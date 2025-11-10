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
        grad: z.nullable(z.number()),
    })
    .superRefine(({ fom, tom, dag, grad }, ctx) => {
        if (kanVelgeGrad(dag)) {
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
            } else if (grad < 0) {
                ctx.addIssue({
                    code: 'too_small',
                    message: `Grad må være minst 0`,
                    minimum: 0,
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
        if (Math.abs(somDato(fom).diff(somDato(tom), 'days')) > 16) {
            ctx.addIssue({
                code: 'custom',
                message: 'Kan ikke legge til dager tidligere enn 16 i forkant av sykmelding',
                input: fom,
                path: ['fom'],
            });
        }
    });
