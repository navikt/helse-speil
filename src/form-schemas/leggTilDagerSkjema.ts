import { z } from 'zod/v4';

import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { utbetalingstabelldagtypeValues } from '@typer/utbetalingstabell';
import { somDato } from '@utils/date';

export type LeggTilDagerFormFields = z.infer<typeof LeggTilDagerSchema>;

export const LeggTilDagerSchema = z
    .object({
        dag: z.enum(utbetalingstabelldagtypeValues),
        fom: z.iso.date(),
        tom: z.iso.date(),
        grad: z.optional(
            z
                .number({
                    error: (issue) =>
                        issue.input == null || issue.input === '' ? 'Velg grad' : 'Grad må være et tall',
                })
                .min(0, 'Grad må være over 0')
                .max(100, 'Grad må være 100 eller lavere'),
        ),
    })
    .superRefine((val, ctx) => {
        if (!kanVelgeGrad(val.dag) && (Number.isNaN(val.grad) || val.grad == null)) {
            ctx.addIssue({
                code: 'custom',
                message: 'Velg grad',
                input: val.grad,
            });
        }
        if (Math.abs(somDato(val.fom).diff(somDato(val.tom), 'days')) > 16) {
            ctx.addIssue({
                code: 'custom',
                message: 'Kan ikke legge til dager tidligere enn 16 i forkant av sykmelding',
                input: val.fom,
            });
        }
    });
