import { z } from 'zod/v4';

import { sperrDagerMedOppholdskrav } from '@form-schemas/dagEndringSkjema';
import {
    Utbetalingstabelldag,
    Utbetalingstabelldagtype,
    utbetalingstabelldagtypeValues,
} from '@typer/utbetalingstabell';

type Prosentfelt = 'sykepengerGrad' | 'gradAndreYtelser';

const sykedagtyper: Utbetalingstabelldagtype[] = ['Syk', 'SykNav'];

type FordelingRefinementCtx = z.RefinementCtx<{ ytelse: string }>;

export function lagGraderteAndreYtelserSchema(markerteDager: Utbetalingstabelldag[]) {
    return z
        .object({
            ytelse: z.enum(utbetalingstabelldagtypeValues, { error: () => 'Annen ytelse er påkrevd' }),
            sykepengerGrad: z.number().nullable(),
            gradAndreYtelser: z.number().nullable(),
            begrunnelse: z.string().trim().min(1, 'Begrunnelse må fylles ut'),
        })
        .superRefine((_, ctx) => validerKlynge(markerteDager, ctx), { when: () => true })
        .superRefine((verdier, ctx) => {
            validerFordeling(verdier, markerteDager, ctx);
            sperrDagerMedOppholdskrav(markerteDager, ctx, 'ytelse');
        });
}

export type GraderteAndreYtelserFormFields = z.infer<ReturnType<typeof lagGraderteAndreYtelserSchema>>;

// Kjøres selv om ytelse mangler, slik at saksbehandler ser med en gang at dagene ikke kan fordeles sammen
function validerKlynge(markerteDager: Utbetalingstabelldag[], ctx: z.RefinementCtx) {
    if (markerteDager.some((dag) => !sykedagtyper.includes(dag.dag.speilDagtype))) {
        ctx.addIssue({
            code: 'custom',
            message: 'Andre ytelser kan bare fordeles på sykedager. Fjern de andre dagene fra utvalget.',
            path: ['sykepengerGrad'],
            continue: false,
        });
        return;
    }

    const sykdomsgrader = [...new Set(markerteDager.map((dag) => dag.grad))];
    if (sykdomsgrader.length > 1) {
        const grader = new Intl.ListFormat('nb', { type: 'conjunction' }).format(
            sykdomsgrader.map((grad) => `${grad ?? 0} %`),
        );
        ctx.addIssue({
            code: 'custom',
            message: `Andre ytelser kan bare fordeles på dager med samme sykdomsgrad. De valgte dagene har ${grader}.`,
            path: ['sykepengerGrad'],
            continue: false,
        });
    }
}

function validerFordeling(
    prosenter: Record<Prosentfelt, number | null>,
    markerteDager: Utbetalingstabelldag[],
    ctx: FordelingRefinementCtx,
) {
    const sykdomsgradFørFordeling = markerteDager[0]?.grad ?? 0;

    validerProsent('sykepengerGrad', prosenter.sykepengerGrad, sykdomsgradFørFordeling, ctx);
    validerProsent('gradAndreYtelser', prosenter.gradAndreYtelser, 99, ctx);

    const { sykepengerGrad, gradAndreYtelser } = prosenter;
    if (!sykepengerGrad || !gradAndreYtelser) return;

    const samletGrad = sykepengerGrad + gradAndreYtelser;
    if (samletGrad > 100) {
        ctx.addIssue({
            code: 'custom',
            message: 'Samlet grad kan ikke overstige 100 %',
            input: samletGrad,
            path: ['sykepengerGrad'],
        });
    } else if (samletGrad < sykdomsgradFørFordeling) {
        const feltnavn = prosentfeltnavn(ctx.value.ytelse);
        ctx.addIssue({
            code: 'custom',
            message: `Arbeidsgraden kan ikke øke. ${feltnavn.sykepengerGrad} og ${feltnavn.gradAndreYtelser.toLocaleLowerCase()} må til sammen være minst ${sykdomsgradFørFordeling} %.`,
            input: samletGrad,
            path: ['sykepengerGrad'],
        });
    }
}

function validerProsent(felt: Prosentfelt, verdi: number | null, maksimum: number, ctx: FordelingRefinementCtx) {
    const feltnavn = prosentfeltnavn(ctx.value.ytelse)[felt];
    if (verdi == null) {
        ctx.addIssue({
            code: 'custom',
            message: `${feltnavn} er påkrevd`,
            input: verdi,
            path: [felt],
        });
    } else if (verdi < 1 || verdi > maksimum) {
        ctx.addIssue({
            code: 'custom',
            message: `${feltnavn} må være mellom 1 og ${maksimum} %`,
            input: verdi,
            path: [felt],
        });
    }
}

function prosentfeltnavn(ytelse: string): Record<Prosentfelt, string> {
    return {
        sykepengerGrad: 'Grad for sykepenger',
        gradAndreYtelser: `Grad for ${ytelse.toLocaleLowerCase()}`,
    };
}
