import z from 'zod/v4';

export type SvarPåDialogSchema = z.infer<typeof svarPåDialogSchema>;
export const svarPåDialogSchema = z.object({
    melding: z.string().min(1, { error: 'Fyll inn melding' }),
});
