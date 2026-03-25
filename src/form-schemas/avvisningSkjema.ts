import { z } from 'zod/v4';

export type AvvisningSkjema = z.infer<typeof avvisningSkjema>;

export const avvisningSkjema = z
    .object({
        begrunnelser: z.array(z.string()).nonempty({ error: 'Velg minst én begrunnelse' }),
        kommentar: z.string(),
        årsak: z.string(),
    })
    .refine((data) => !data.begrunnelser.includes('Annet') || (data.kommentar && data.kommentar.trim().length > 0), {
        error: 'Skriv en kommentar hvis du velger begrunnelsen "annet"',
        path: ['kommentar'],
    });
