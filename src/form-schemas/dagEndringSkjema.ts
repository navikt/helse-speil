import { z } from 'zod/v4';

import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { utbetalingstabelldagtypeValues } from '@typer/utbetalingstabell';

export type DagEndringFormFields = z.infer<ReturnType<typeof lagDagEndringSchema>>;

export const lagDagEndringSchema = (minimumGrad: number) =>
    z
        .object({
            dagtype: z.enum(utbetalingstabelldagtypeValues),
            grad: z.nullable(
                z
                    .number({
                        error: (issue) =>
                            issue.input == null || issue.input === '' ? 'Velg grad' : 'Grad må være et tall',
                    })
                    .min(minimumGrad, `Grad må være minst ${minimumGrad}`)
                    .max(100, 'Grad må være 100 eller lavere'),
            ),
        })
        .refine((val) => kanVelgeGrad(val.dagtype) && !(Number.isNaN(val.grad) || val.grad == null), {
            error: 'Velg grad',
            path: ['grad'],
        });
