import z from 'zod/v4';

export type NyDialogmeldingSchema = z.infer<typeof nyDialogmeldingSchema>;
export const nyDialogmeldingSchema = z.object({
    behandlerId: z.string().min(1, { error: 'Velg en behandler' }),
    type: z.enum(['L8', 'L40'], { error: 'Velg type' }),
    melding: z.string().min(1, { error: 'Fyll inn melding' }),
});
