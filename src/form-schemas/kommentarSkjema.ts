import { z } from 'zod/v4';

export type KommentarFormFields = z.infer<typeof kommentarSkjema>;

export const kommentarSkjema = z.object({
    tekst: z.string('Kommentar må fylles ut').nonempty('Kommentar må fylles ut'),
});
