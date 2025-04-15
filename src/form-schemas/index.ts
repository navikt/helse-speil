import { z } from 'zod';

export const stansAutomatiskBehandlingSchema = z.object({
    begrunnelse: z
        .string()
        .min(1, { message: 'Fyll inn begrunnelse for stans av automatisk behandling.' })
        .max(1000, { message: 'Begrunnelsen kan maks være 1000 tegn.' }),
});
