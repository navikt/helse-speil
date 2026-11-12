import { z } from 'zod/v4';

import { sperrDagerMedOppholdskrav } from '@form-schemas/dagEndringSkjema';
import { visningstekstForGradertAnnenYtelse } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { GradertAnnenYtelsetype, gradertAnnenYtelsetypeValues } from '@typer/overstyring';
import { Utbetalingstabelldag, Utbetalingstabelldagtype } from '@typer/utbetalingstabell';

const sykedagtyper: Utbetalingstabelldagtype[] = ['Syk', 'SykNav', 'SykHelg', 'UtenforEøs'];

const gradertAnnenYtelsetype = z.enum(gradertAnnenYtelsetypeValues);

export function lagGraderteAndreYtelserSchema(markerteDager: Utbetalingstabelldag[]) {
    return z
        .object({
            ytelser: z.array(gradertAnnenYtelsetype).min(1, 'Annen ytelse er påkrevd'),
            sykepengerGrad: z.number().nullable(),
            andreYtelserGrader: z.partialRecord(gradertAnnenYtelsetype, z.number().nullable()),
            begrunnelse: z.string().trim().min(1, 'Begrunnelse må fylles ut'),
        })
        .superRefine((_, ctx) => validerKlynge(markerteDager, ctx), { when: () => true })
        .superRefine((verdier, ctx) => {
            validerFordeling(verdier, markerteDager, ctx);
            sperrDagerMedOppholdskrav(markerteDager, ctx, 'ytelser');
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
    { ytelser, sykepengerGrad, andreYtelserGrader }: GraderteAndreYtelserFormFields,
    markerteDager: Utbetalingstabelldag[],
    ctx: z.RefinementCtx,
) {
    if (ytelser.length === 0) return;
    const sykdomsgradFørFordeling = markerteDager[0]?.grad ?? 0;

    validerProsent(['sykepengerGrad'], 'Grad for sykepenger', sykepengerGrad, sykdomsgradFørFordeling, ctx);
    ytelser.forEach((ytelse) =>
        validerProsent(
            ['andreYtelserGrader', ytelse],
            gradfeltnavn(ytelse),
            andreYtelserGrader[ytelse] ?? null,
            99,
            ctx,
        ),
    );

    const ytelsesgrader = ytelser.map((ytelse) => andreYtelserGrader[ytelse] ?? 0);
    if (!sykepengerGrad || ytelsesgrader.includes(0)) return;

    const samletGrad = ytelsesgrader.reduce((sum, grad) => sum + grad, sykepengerGrad);
    if (samletGrad > 100) {
        ctx.addIssue({
            code: 'custom',
            message: 'Samlet grad kan ikke overstige 100 %',
            input: samletGrad,
            path: ['sykepengerGrad'],
        });
    } else if (samletGrad < sykdomsgradFørFordeling) {
        const feltnavn = ['Grad for sykepenger', ...ytelser.map((ytelse) => gradfeltnavn(ytelse).toLocaleLowerCase())];
        ctx.addIssue({
            code: 'custom',
            message: `Arbeidsgraden kan ikke øke. ${new Intl.ListFormat('nb', { type: 'conjunction' }).format(feltnavn)} må til sammen være minst ${sykdomsgradFørFordeling} %.`,
            input: samletGrad,
            path: ['sykepengerGrad'],
        });
    }
}

function validerProsent(
    path: PropertyKey[],
    feltnavn: string,
    verdi: number | null,
    maksimum: number,
    ctx: z.RefinementCtx,
) {
    if (verdi == null) {
        ctx.addIssue({ code: 'custom', message: `${feltnavn} er påkrevd`, input: verdi, path });
    } else if (verdi < 1 || verdi > maksimum) {
        ctx.addIssue({
            code: 'custom',
            message: `${feltnavn} må være mellom 1 og ${maksimum} %`,
            input: verdi,
            path,
        });
    }
}

export function gradfeltnavn(ytelse: GradertAnnenYtelsetype): string {
    return `Grad for ${visningstekstForGradertAnnenYtelse(ytelse).toLocaleLowerCase()}`;
}
