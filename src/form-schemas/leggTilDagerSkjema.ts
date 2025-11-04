import { number, z } from 'zod/v4';

import { OverstyrbarDagtype } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { DateString } from '@typer/shared';
import { erFør, somDato } from '@utils/date';

export type LeggTilDagerSchema = z.infer<ReturnType<typeof lagLeggTilDagerSchema>>;

export const lagLeggTilDagerSchema = (tom: DateString) => {
    return z
        .object({
            fom: z.iso
                .date({
                    error: (issue) =>
                        issue.input == undefined ? 'Fra og med er påkrevd' : 'Fra og med må være gyldig dato',
                })
                .refine((dato) => erFør(dato, tom), 'Fra og med må være før til og med dato')
                .refine(
                    (dato) => somDato(dato).diff(somDato(tom), 'days') >= -16,
                    'Fra og med må være maks 16 dager i forkant av til og med dato',
                ),
            dagtype: z.enum(OverstyrbarDagtype, {
                error: (issue) => (issue.input == undefined ? 'Dagtype er påkrevd' : 'Ugylding dagtype'),
            }),
            grad: z.optional(number().min(0).max(100)),
        })
        .superRefine((data, ctx) => {
            if (kanVelgeGrad(data.dagtype) && data.grad == undefined) {
                ctx.addIssue({
                    code: 'invalid_type',
                    expected: 'custom',
                    message: 'Grad er påkrevd for dagtype',
                    input: data,
                });
            }
            if (!kanVelgeGrad(data.dagtype) && data.grad != undefined) {
                ctx.addIssue({
                    code: 'invalid_type',
                    expected: 'undefined',
                    message: 'Dagtype uten gradering skal ikke ha grad',
                    input: data,
                });
            }
        });
};

export const lagEndreDagerSchema = () => {
    return z.object({});
};

export const lagOverstyrDagerSchema = () => {
    return z.object({});
};
