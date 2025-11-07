import { z } from 'zod/v4';

import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { utbetalingstabelldagtypeValues } from '@typer/utbetalingstabell';

export type DagEndringFormFields = z.infer<ReturnType<typeof lagDagEndringSchema>>;

export const lagDagEndringSchema = (minimumGrad: number) =>
    z
        .object({
            dagtype: z.enum(utbetalingstabelldagtypeValues),
            grad: z.nullable(z.number()),
        })
        .superRefine(({ dagtype, grad }, ctx) => {
            if (kanVelgeGrad(dagtype)) {
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
            }
        });
