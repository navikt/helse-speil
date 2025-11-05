import { number, z } from 'zod/v4';

import { OverstyrbarDagtype } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

export type DagoverstyringSchema = z.infer<ReturnType<typeof lagDagoverstyringSchema>>;

export const lagDagoverstyringSchema = () => {
    return z.object({
        dager: z.array(z.object<Utbetalingstabelldag>()),
        valgteDager: z.array(z.number()),
        endring: z.object({
            dagtype: z.enum(OverstyrbarDagtype),
            grad: z.nullable(number().min(0).max(100)),
        }),
        nyeDager: z.object({
            fom: z.iso.date(),
            tom: z.iso.date(),
            dagtype: z.enum(OverstyrbarDagtype),
            grad: z.nullable(number().min(0).max(100)),
        }),
        notat: z.string(),
    });
};
