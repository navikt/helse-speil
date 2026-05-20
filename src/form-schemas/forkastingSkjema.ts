import { z } from 'zod/v4';

export type ForkastingSkjema = z.infer<typeof forkastingSkjema>;

export const forkastingSkjema = z
    .object({
        arsaker: z.array(z.string()).nonempty({ error: 'Velg minst en årsak' }),
        kommentar: z.string(),
    })
    .refine(
        (data) => !data.arsaker.some((it) => JSON.parse(it).arsak === 'Annet') || data.kommentar.trim().length > 0,
        {
            error: 'Skriv en kommentar hvis du velger årsaken "annet"',
            path: ['kommentar'],
        },
    );
