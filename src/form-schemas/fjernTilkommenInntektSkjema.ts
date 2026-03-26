import { z } from 'zod/v4';

export type FjernTilkommenInntektSkjema = z.infer<typeof fjernTilkommenInntektSkjema>;

export const fjernTilkommenInntektSkjema = z.object({
    begrunnelse: z.string().nonempty('Begrunnelse må fylles ut'),
});
