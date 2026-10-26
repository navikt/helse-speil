import z from 'zod/v4';

import { begrunnelseOgJournalpostFelter, sjekkJournalpost } from '@form-schemas/opptjeningSkjema';
import { ApiUtfall, ApiVilkårskode } from '@io/rest/generated/vilkarsproving.schemas';

// Likestilt ytelse vurderes med eget skjema og står for hele § 8-2 andre ledd
export const manueltVurderbareVilkårskoder = [
    ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
    ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE_MINST_4_UKER,
] as const;

export type ManueltVurderbarVilkårskode = (typeof manueltVurderbareVilkårskoder)[number];

export type EnkeltvurderbarVilkårskode = typeof ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER;

export const vilkårsspørsmål: Record<EnkeltvurderbarVilkårskode, string> = {
    [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER]: 'Vurder om søkeren har hatt arbeid i minst 4 uker',
};

export type ManuellVurderingAvVilkårSchema = z.infer<typeof manuellVurderingAvVilkårSkjema>;
export const manuellVurderingAvVilkårSkjema = z
    .object({
        utfall: z.enum([ApiUtfall.OPPFYLT, ApiUtfall.IKKE_OPPFYLT], { error: 'Velg utfall' }),
        ...begrunnelseOgJournalpostFelter,
    })
    .check((ctx) => sjekkJournalpost(ctx));
