import kodeverk from './vilkårskodeverk.json';

import { ManueltVurderbarVilkårskode } from '@/form-schemas/overstyrVilkårsvurderingSkjema';
import { ApiVilkårskode } from '@io/rest/generated/vilkarsproving.schemas';

export interface Vilkårshjemmel {
    lovverk: string;
    lovverksversjon: string;
    kapittel: string;
    paragraf: string;
    ledd?: string | null;
    setning?: string | null;
    bokstav?: string | null;
}

export interface Kodeverkvilkår {
    kode: string;
    beskrivelse: string;
    vilkårshjemmel: Vilkårshjemmel;
}

// Kodeverket bruker andre koder enn vilkårsprøvingsapiet
const kodeverkskoder: Record<ManueltVurderbarVilkårskode, string> = {
    [ApiVilkårskode.OPPTJENING_ARBEID_MINST_4_UKER]: 'OPPTJENING_MINST_4_UKER',
    [ApiVilkårskode.OPPTJENING_LIKESTILT_YTELSE]: 'OPPTJENING_ANNEN_YTELSE',
};

const erStøttetVilkårskode = (vilkårskode: ApiVilkårskode): vilkårskode is ManueltVurderbarVilkårskode =>
    vilkårskode in kodeverkskoder;

export const finnKodeverkvilkår = (vilkårskode: ApiVilkårskode): Kodeverkvilkår | undefined => {
    if (!erStøttetVilkårskode(vilkårskode)) return undefined;
    const kodeverkskode = kodeverkskoder[vilkårskode];
    return (kodeverk as Kodeverkvilkår[]).find((vilkår) => vilkår.kode === kodeverkskode);
};

export const somParagrafhenvisning = ({ kapittel, paragraf, ledd, setning }: Vilkårshjemmel): string =>
    [`§${kapittel}-${paragraf}`, ledd ? `ledd ${ledd}` : undefined, setning ? `setning ${setning}` : undefined]
        .filter((del) => del !== undefined)
        .join(' ');
