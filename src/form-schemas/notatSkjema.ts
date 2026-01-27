import { z } from 'zod/v4';

export type NotatFormFields = z.infer<typeof notatSkjema>;

export const notatSkjema = z.object({
    tekst: z.string().min(1, 'Notat må fylles ut').max(2000, 'Det er kun tillatt med 2000 tegn'),
});
