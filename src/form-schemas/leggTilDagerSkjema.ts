import { number, z } from 'zod/v4';

import { OverstyrbarDagtype } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import { kanVelgeGrad } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/kanVelgeGrad';
import { DateString } from '@typer/shared';
import { erFør } from '@utils/date';

export type LeggTilDagerSchema = z.infer<ReturnType<typeof lagLeggTilDagerSchema>>;

export const lagLeggTilDagerSchema = (tom: DateString) => {
    return z
        .object({
            fom: z.iso.date().refine((dato) => erFør(dato, tom)),
            dagtype: z.enum(OverstyrbarDagtype),
            grad: z.optional(number().max(100).min(0)),
        })
        .refine((data) => kanVelgeGrad(data.dagtype));
};

export const lagEndreDagerSchema = () => {
    return z.object({});
};

export const lagOverstyrDagerSchema = () => {
    return z.object({});
};
