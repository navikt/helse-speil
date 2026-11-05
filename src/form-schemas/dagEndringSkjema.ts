import { z } from 'zod/v4';

import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import {
    dagenEllerDagene,
    dagerMedOppholdskrav,
    somDagliste,
} from '@saksbilde/utbetaling/utbetalingstabell/oppholdskravSperrer';
import { Egenmeldingsdag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import {
    Utbetalingstabelldag,
    utbetalingstabelldagtypeSelvstendigValues,
    utbetalingstabelldagtypeValues,
} from '@typer/utbetalingstabell';

const lagGradValidering = (minimumGrad: number) => (grad: number | null, ctx: z.RefinementCtx) => {
    if (grad == null || (grad as unknown) === '') {
        ctx.addIssue({
            code: 'custom',
            message: 'Velg grad',
            input: grad,
            path: ['grad'],
        });
    } else if (Number.isNaN(grad)) {
        ctx.addIssue({
            code: 'custom',
            message: 'Grad må være et tall',
            input: grad,
            path: ['grad'],
        });
    } else if (grad < minimumGrad) {
        ctx.addIssue({
            code: 'too_small',
            message: `Grad må være minst ${minimumGrad}`,
            minimum: minimumGrad,
            origin: 'number',
            input: grad,
            path: ['grad'],
        });
    } else if (grad > 100) {
        ctx.addIssue({
            code: 'too_big',
            message: 'Grad må være 100 eller lavere',
            maximum: 100,
            origin: 'number',
            input: grad,
            path: ['grad'],
        });
    }
};

const dagtypeFeilmelding = (issue: { input?: unknown }) => (issue.input === '' ? 'Annen ytelse er påkrevd' : undefined);

type GradertAnnenYtelseFelt = 'sykepengerGrad' | 'gradAndreYtelser';

const gradertAnnenYtelseFeltnavn = (ytelse?: string) => ({
    sykepengerGrad: 'Grad for sykepenger',
    gradAndreYtelser: `Grad for ${ytelse?.toLocaleLowerCase()}`,
});

const validerProsent = (
    felt: GradertAnnenYtelseFelt,
    verdi: number | null | undefined,
    max: number,
    ctx: z.RefinementCtx<{ dagtype: string }>,
) => {
    if (verdi == null) {
        ctx.addIssue({
            code: 'custom',
            message: `${gradertAnnenYtelseFeltnavn(ctx.value.dagtype)[felt]} er påkrevd`,
            input: verdi,
            path: [felt],
        });
    } else if (verdi < 1 || verdi > max) {
        ctx.addIssue({
            code: 'custom',
            message: `${gradertAnnenYtelseFeltnavn(ctx.value.dagtype)[felt]} må være mellom 1 og ${max} %`,
            input: verdi,
            path: [felt],
        });
    }
};

const validerGradertAnnenYtelse = (
    felter: Partial<Record<GradertAnnenYtelseFelt, number | null>>,
    markerteDager: Utbetalingstabelldag[],
    ctx: z.RefinementCtx<{ dagtype: string }>,
) => {
    if (markerteDager.some((dag) => !dag.grad)) {
        ctx.addIssue({
            code: 'custom',
            message: 'Andre ytelser kan bare fordeles på dager med sykdomsgrad',
            input: felter.sykepengerGrad,
            path: ['sykepengerGrad'],
        });
        return;
    }

    const sykdomsgraderFørFordeling = markerteDager.map((dag) => dag.grad ?? 0);
    const lavesteSykdomsgradFørFordeling = Math.min(100, ...sykdomsgraderFørFordeling);
    const høyesteSykdomsgradFørFordeling = Math.max(0, ...sykdomsgraderFørFordeling);

    validerProsent('sykepengerGrad', felter.sykepengerGrad, lavesteSykdomsgradFørFordeling, ctx);
    validerProsent('gradAndreYtelser', felter.gradAndreYtelser, 99, ctx);

    const { sykepengerGrad, gradAndreYtelser } = felter;
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
        const feltnavn = gradertAnnenYtelseFeltnavn(ctx.value.dagtype);
        ctx.addIssue({
            code: 'custom',
            message: `Arbeidsgraden kan ikke øke. ${feltnavn.sykepengerGrad} og ${feltnavn.gradAndreYtelser.toLocaleLowerCase()} må til sammen være minst ${høyesteSykdomsgradFørFordeling} %.`,
            input: samletGrad,
            path: ['sykepengerGrad'],
        });
    }
};

const gradertAnnenYtelseFelter = {
    sykepengerGrad: z.number().nullable().optional(),
    gradAndreYtelser: z.number().nullable().optional(),
    gradererAnnenYtelse: z.boolean().optional(),
};

export const lagDagEndringSchema = (minimumGrad: number, markerteDager: Utbetalingstabelldag[]) =>
    z
        .object({
            dagtype: z.enum(utbetalingstabelldagtypeValues, { error: dagtypeFeilmelding }),
            grad: z.nullable(z.number()),
            ...gradertAnnenYtelseFelter,
        })
        .superRefine(({ dagtype, grad, gradererAnnenYtelse, ...gradertAnnenYtelse }, ctx) => {
            if (gradererAnnenYtelse) {
                validerGradertAnnenYtelse(gradertAnnenYtelse, markerteDager, ctx);
            } else if (kanVelgeGrad(dagtype)) {
                lagGradValidering(minimumGrad)(grad, ctx);
            }
            if (
                (dagtype === 'SykNav' || dagtype === 'Syk') &&
                markerteDager.some((markertDag) => markertDag.dag === Egenmeldingsdag)
            ) {
                const melding = dagtype === 'SykNav' ? 'Syk (Nav)' : 'Syk';
                ctx.addIssue({
                    code: 'custom',
                    message: `Du kan ikke overstyre Egenmelding til ${melding}`,
                    input: dagtype,
                    path: ['dagtype'],
                });
            }
            sperrDagerMedOppholdskrav(markerteDager, ctx);
        });

const erMeldingTilNavtype = (dagtype: string): boolean =>
    dagtype === 'MeldingTilNav' || dagtype === 'AvslattMeldingTilNav';

export const lagDagEndringSelvstendigSchema = (minimumGrad: number, markerteDager: Utbetalingstabelldag[]) =>
    z
        .object({
            dagtype: z.enum(utbetalingstabelldagtypeSelvstendigValues, { error: dagtypeFeilmelding }),
            grad: z.nullable(z.number()),
            ...gradertAnnenYtelseFelter,
        })
        .superRefine(({ dagtype, grad, gradererAnnenYtelse, ...gradertAnnenYtelse }, ctx) => {
            if (gradererAnnenYtelse) {
                validerGradertAnnenYtelse(gradertAnnenYtelse, markerteDager, ctx);
            } else if (kanVelgeGrad(dagtype)) {
                lagGradValidering(minimumGrad)(grad, ctx);
            }

            const noenErMeldingTilNavtype = markerteDager.some((markertDag) =>
                erMeldingTilNavtype(markertDag.dag.speilDagtype),
            );
            const meldingIsolasjon = 'Melding til Nav og Avslått melding til Nav kan kun endres til hverandre';

            if (noenErMeldingTilNavtype && !erMeldingTilNavtype(dagtype)) {
                ctx.addIssue({
                    code: 'custom',
                    message: meldingIsolasjon,
                    input: dagtype,
                    path: ['dagtype'],
                });
            }

            if (!noenErMeldingTilNavtype && erMeldingTilNavtype(dagtype)) {
                ctx.addIssue({
                    code: 'custom',
                    message: meldingIsolasjon,
                    input: dagtype,
                    path: ['dagtype'],
                });
            }
            sperrDagerMedOppholdskrav(markerteDager, ctx);
        });

export type DagEndringArbeidstakerFormFields = z.infer<ReturnType<typeof lagDagEndringSchema>>;
export type DagEndringSelvstendigFormFields = z.infer<ReturnType<typeof lagDagEndringSelvstendigSchema>>;

// Spleis avviser overstyring av dager med avslag fra sp-avslagsdager. Dagene endres ved å gjøre om vurderingen.
function sperrDagerMedOppholdskrav(markerteDager: Utbetalingstabelldag[], ctx: z.RefinementCtx) {
    const dager = dagerMedOppholdskrav(markerteDager);
    if (dager.length === 0) return;
    ctx.addIssue({
        code: 'custom',
        message: `${somDagliste(dager.map((dag) => dag.dato))} er avslått etter oppholdskravet. Gjør om vurderingen av oppholdskravet før du endrer ${dagenEllerDagene(dager.length)}.`,
        input: markerteDager,
        path: ['dagtype'],
    });
}
