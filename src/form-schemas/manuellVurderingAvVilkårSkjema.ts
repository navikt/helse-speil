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

export type ManuellVurderingAvVilkårSchema = z.infer<typeof manuellVurderingAvVilkårSkjema>;
export const manuellVurderingAvVilkårSkjema = z.object({
    utfall: z.enum([ApiUtfall.OPPFYLT, ApiUtfall.IKKE_OPPFYLT], { error: 'Velg utfall' }),
    fritekstbegrunnelse: z.string().min(1, { error: 'Fyll inn begrunnelse' }),
    dokumentIder: z.array(z.object({ verdi: z.string() })),
});
