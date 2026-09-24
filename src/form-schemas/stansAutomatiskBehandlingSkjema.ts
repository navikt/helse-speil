import { z } from 'zod/v4';

export type StansAutomatiskBehandlingSchema = z.infer<typeof stansAutomatiskBehandlingSchema>;
export const stansAutomatiskBehandlingSchema = z.object({
    begrunnelse: z
        .string()
        .min(1, { error: 'Fyll inn begrunnelse.' })
        .max(1000, { error: 'Begrunnelsen kan maks være 1000 tegn.' }),
    fodselsnummer: z.string(),
});
