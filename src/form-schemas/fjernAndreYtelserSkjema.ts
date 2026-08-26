import { z } from 'zod/v4';

export type FjernAndreYtelserSkjema = z.infer<typeof fjernAndreYtelserSkjema>;

export const fjernAndreYtelserSkjema = z.object({
    begrunnelse: z.string().nonempty('Begrunnelse må fylles ut'),
});
