import z from 'zod/v4';

export const Journalpostvalg = {
    OPPLYST_I_SPEIL: 'OPPLYST_I_SPEIL',
    LEGG_TIL_JOURNALPOST: 'LEGG_TIL_JOURNALPOST',
} as const;

export const begrunnelseOgJournalpostFelter = {
    fritekstbegrunnelse: z.string().min(1, { error: 'Fyll inn begrunnelse' }),
    // Valgfri her og påkrevd i sjekkJournalpost, så de andre feilene i skjemaet også vises når valget mangler
    journalpostvalg: z.enum([Journalpostvalg.OPPLYST_I_SPEIL, Journalpostvalg.LEGG_TIL_JOURNALPOST]).optional(),
    journalpostIder: z.array(
        z.object({
            verdi: z.string().regex(/^$|^\d{1,11}$/, { error: 'Dokument-ID må være 1 til 11 siffer' }),
        }),
    ),
};

export type BegrunnelseOgJournalpostSchema = z.infer<z.ZodObject<typeof begrunnelseOgJournalpostFelter>>;

export const begrunnelseOgJournalpostDefaultValues: Partial<BegrunnelseOgJournalpostSchema> = {
    fritekstbegrunnelse: '',
    journalpostIder: [{ verdi: '' }],
};

export function sjekkJournalpost(ctx: z.core.ParsePayload<BegrunnelseOgJournalpostSchema>) {
    const { journalpostvalg, journalpostIder } = ctx.value;
    if (journalpostvalg === undefined) {
        ctx.issues.push({
            code: 'custom',
            message: 'Velg om du vil legge til journalpost-ID',
            path: ['journalpostvalg'],
            input: journalpostvalg,
        });
    }
    if (
        journalpostvalg === Journalpostvalg.LEGG_TIL_JOURNALPOST &&
        journalpostIder.every((journalpostId) => journalpostId.verdi === '')
    ) {
        ctx.issues.push({
            code: 'custom',
            message: 'Fyll inn journalpost-ID',
            path: ['journalpostIder', 0, 'verdi'],
            input: journalpostIder,
        });
    }
}

export function journalpostIderTilRequest({
    journalpostvalg,
    journalpostIder,
}: Pick<BegrunnelseOgJournalpostSchema, 'journalpostvalg' | 'journalpostIder'>): string[] {
    return journalpostvalg === Journalpostvalg.LEGG_TIL_JOURNALPOST
        ? journalpostIder.map((journalpostId) => journalpostId.verdi).filter((verdi) => verdi !== '')
        : [];
}
