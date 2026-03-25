import { z } from 'zod/v4';

export type PåVentSkjema = z.infer<typeof påVentSkjema>;

export const påVentSkjema = z
    .object({
        årsaker: z.array(z.string()).nonempty({ error: 'Velg minst én årsak' }),
        notattekst: z.string().max(2000, { error: 'Det er kun tillatt med 2000 tegn' }),
        frist: z.date({ error: 'Oppfølgingsdato må være satt' }),
        skalTildeles: z.boolean(),
    })
    .refine((data) => !data.årsaker.includes('Annet') || data.notattekst.trim().length > 0, {
        error: 'Notat må fylles ut',
        path: ['notattekst'],
    });
