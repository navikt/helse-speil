import z from 'zod/v4';

import { ApiUtfall, ApiVilkårskode } from '@io/rest/generated/vilkarsproving.schemas';

export const manueltVurderbareVilkårskoder = [
    ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER,
    ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE,
] as const;

export type ManueltVurderbarVilkårskode = (typeof manueltVurderbareVilkårskoder)[number];

export const vilkårskodeLabels: Record<ManueltVurderbarVilkårskode, string> = {
    [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER]: 'Arbeid i minst 4 uker',
    [ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE]: 'Likestilt ytelse',
};

export type OverstyrVilkårsvurderingSchema = z.infer<typeof overstyrVilkårsvurderingSkjema>;
export const overstyrVilkårsvurderingSkjema = z.object({
    utfall: z.enum([ApiUtfall.OPPFYLT, ApiUtfall.IKKE_OPPFYLT], { error: 'Velg utfall' }),
    fritekstbegrunnelse: z.string().min(1, { error: 'Fyll inn begrunnelse' }),
});
