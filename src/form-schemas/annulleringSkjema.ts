import { z } from 'zod/v4';

export type AnnulleringSkjema = z.infer<typeof annulleringSkjema>;

export const annulleringSkjema = z
    .object({
        arsaker: z.array(z.string()).nonempty({ error: 'Velg minst én årsak' }),
        kommentar: z.string(),
        arbeidsgiverFagsystemId: z.string(),
        personFagsystemId: z.string(),
    })
    .refine(
        (data) => !data.arsaker.some((it) => JSON.parse(it).arsak === 'Annet') || data.kommentar.trim().length > 0,
        {
            error: 'Skriv en kommentar hvis du velger årsaken "annet"',
            path: ['kommentar'],
        },
    );
