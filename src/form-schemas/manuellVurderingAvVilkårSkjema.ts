import z from 'zod/v4';

import { ApiUtfall, ApiVilkårskode } from '@io/rest/generated/vilkarsproving.schemas';

export const manueltVurderbareVilkårskoder = [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER] as const;

export type ManueltVurderbarVilkårskode = (typeof manueltVurderbareVilkårskoder)[number];

export const vilkårskodeLabels: Record<ManueltVurderbarVilkårskode, string> = {
    [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER]: 'Arbeid i minst 4 uker',
};

export const vilkårsspørsmål: Record<ManueltVurderbarVilkårskode, string> = {
    [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER]: 'Vurder om søkeren har hatt arbeid i minst 4 uker',
};

export const Journalpostvalg = {
    OPPLYST_I_SPEIL: 'OPPLYST_I_SPEIL',
    LEGG_TIL_JOURNALPOST: 'LEGG_TIL_JOURNALPOST',
} as const;

export type ManuellVurderingAvVilkårSchema = z.infer<typeof manuellVurderingAvVilkårSkjema>;
export const manuellVurderingAvVilkårSkjema = z
    .object({
        utfall: z.enum([ApiUtfall.OPPFYLT, ApiUtfall.IKKE_OPPFYLT], { error: 'Velg utfall' }),
        fritekstbegrunnelse: z.string().min(1, { error: 'Fyll inn begrunnelse' }),
        journalpostvalg: z.enum([Journalpostvalg.OPPLYST_I_SPEIL, Journalpostvalg.LEGG_TIL_JOURNALPOST], {
            error: 'Velg om du vil legge til journalpost-ID',
        }),
        journalpostIder: z.array(
            z.object({
                verdi: z.string().regex(/^$|^\d{1,11}$/, { error: 'Dokument-ID må være 1 til 11 siffer' }),
            }),
        ),
    })
    .check((ctx) => {
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
    });
