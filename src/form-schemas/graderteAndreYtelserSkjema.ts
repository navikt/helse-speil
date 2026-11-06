import { z } from 'zod/v4';

import { sperrDagerMedOppholdskrav } from '@form-schemas/dagEndringSkjema';
import { Utbetalingstabelldag, utbetalingstabelldagtypeValues } from '@typer/utbetalingstabell';

type Prosentfelt = 'sykepengerGrad' | 'gradAndreYtelser';

type FordelingRefinementCtx = z.RefinementCtx<{ ytelse: string }>;

export function lagGraderteAndreYtelserSchema(markerteDager: Utbetalingstabelldag[]) {
    return z
        .object({
            ytelse: z.enum(utbetalingstabelldagtypeValues, { error: () => 'Annen ytelse er påkrevd' }),
            sykepengerGrad: z.number().nullable(),
            gradAndreYtelser: z.number().nullable(),
        })
        .superRefine((verdier, ctx) => {
            validerFordeling(verdier, markerteDager, ctx);
            sperrDagerMedOppholdskrav(markerteDager, ctx, 'ytelse');
        });
}

export type GraderteAndreYtelserFormFields = z.infer<ReturnType<typeof lagGraderteAndreYtelserSchema>>;

function validerFordeling(
    prosenter: Record<Prosentfelt, number | null>,
    markerteDager: Utbetalingstabelldag[],
    ctx: FordelingRefinementCtx,
) {
    if (markerteDager.some((dag) => !dag.grad)) {
        ctx.addIssue({
            code: 'custom',
            message: 'Andre ytelser kan bare fordeles på dager med sykdomsgrad',
            input: prosenter.sykepengerGrad,
            path: ['sykepengerGrad'],
        });
        return;
    }

    const sykdomsgraderFørFordeling = markerteDager.map((dag) => dag.grad ?? 0);
    const lavesteSykdomsgradFørFordeling = Math.min(100, ...sykdomsgraderFørFordeling);
    const høyesteSykdomsgradFørFordeling = Math.max(0, ...sykdomsgraderFørFordeling);

    validerProsent('sykepengerGrad', prosenter.sykepengerGrad, lavesteSykdomsgradFørFordeling, ctx);
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
    } else if (samletGrad < høyesteSykdomsgradFørFordeling) {
        const feltnavn = prosentfeltnavn(ctx.value.ytelse);
        ctx.addIssue({
            code: 'custom',
            message: `Arbeidsgraden kan ikke øke. ${feltnavn.sykepengerGrad} og ${feltnavn.gradAndreYtelser.toLocaleLowerCase()} må til sammen være minst ${høyesteSykdomsgradFørFordeling} %.`,
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
