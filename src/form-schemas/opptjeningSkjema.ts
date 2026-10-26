import z from 'zod/v4';

import { ApiVilkårskode } from '@io/rest/generated/vilkarsproving.schemas';

export const vilkårskodeLabels: Record<ApiVilkårskode, string> = {
    [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER]: 'Arbeid i minst 4 uker',
    [ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER]: 'Likestilt ytelse i minst 4 uker',
    [ApiVilkårskode.OPPTJENING_FORELDREPENGER_IKKE_OPPTJENT_PA_AAP]: 'Foreldrepenger ikke opptjent på AAP',
    [ApiVilkårskode.OPPTJENING_YRKESAKTIV_MINST_4_UKER_FOR_UTTAK_AV_FORELDREPENGER]:
        'Yrkesaktiv i minst 4 uker før uttak av foreldrepenger',
};

export const Journalpostvalg = {
    OPPLYST_I_SPEIL: 'OPPLYST_I_SPEIL',
    LEGG_TIL_JOURNALPOST: 'LEGG_TIL_JOURNALPOST',
} as const;

export const begrunnelseOgJournalpostFelter = {
    fritekstbegrunnelse: z.string().min(1, { error: 'Fyll inn begrunnelse' }),
    journalpostvalg: z.enum([Journalpostvalg.OPPLYST_I_SPEIL, Journalpostvalg.LEGG_TIL_JOURNALPOST], {
        error: 'Velg om du vil legge til journalpost-ID',
    }),
    journalpostIder: z.array(
        z.object({
            verdi: z.string().regex(/^$|^\d{1,11}$/, { error: 'Dokument-ID må være 1 til 11 siffer' }),
        }),
    ),
};

export type BegrunnelseOgJournalpostSchema = z.infer<z.ZodObject<typeof begrunnelseOgJournalpostFelter>>;

export const begrunnelseOgJournalpostDefaultValues: BegrunnelseOgJournalpostSchema = {
    fritekstbegrunnelse: '',
    journalpostvalg: Journalpostvalg.OPPLYST_I_SPEIL,
    journalpostIder: [{ verdi: '' }],
};

export function sjekkJournalpost(ctx: z.core.ParsePayload<BegrunnelseOgJournalpostSchema>) {
    const { journalpostvalg, journalpostIder } = ctx.value;
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
