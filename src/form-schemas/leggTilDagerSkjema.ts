import { z } from 'zod/v4';

import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { utbetalingstabelldagtypeValues } from '@typer/utbetalingstabell';

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
    .refine((val) => kanVelgeGrad(val.dag) && !(Number.isNaN(val.grad) || val.grad == null), {
        error: 'Velg grad',
        path: ['grad'],
    });
