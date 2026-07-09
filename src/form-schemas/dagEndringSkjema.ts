import { z } from 'zod/v4';

import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
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

export const lagDagEndringSchema = (minimumGrad: number, markerteDager: Utbetalingstabelldag[]) =>
    z
        .object({
            dagtype: z.enum(utbetalingstabelldagtypeValues),
            grad: z.nullable(z.number()),
        })
        .superRefine(({ dagtype, grad }, ctx) => {
            if (kanVelgeGrad(dagtype)) {
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
        });

const erMeldingTilNavtype = (dagtype: string): boolean =>
    dagtype === 'MeldingTilNav' || dagtype === 'AvslattMeldingTilNav';

export const lagDagEndringSelvstendigSchema = (minimumGrad: number, markerteDager: Utbetalingstabelldag[]) =>
    z
        .object({
            dagtype: z.enum(utbetalingstabelldagtypeSelvstendigValues),
            grad: z.nullable(z.number()),
        })
        .superRefine(({ dagtype, grad }, ctx) => {
            if (kanVelgeGrad(dagtype)) {
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
        });

export type DagEndringArbeidstakerFormFields = z.infer<ReturnType<typeof lagDagEndringSchema>>;
export type DagEndringSelvstendigFormFields = z.infer<ReturnType<typeof lagDagEndringSelvstendigSchema>>;
