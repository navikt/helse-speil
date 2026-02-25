import type { Automatisk, Manuell } from '@io/rest/generated/spesialist.schemas';

import { vilkårskodeverk } from './kodeverk';
import { saksbehandlerUiKodeverk } from './saksbehandlerUiKodeverk';

type VurderingType = Automatisk | Manuell;

export function getVilkårInfo(vilkårskode: string) {
    return saksbehandlerUiKodeverk.find((v) => v.vilkårskode === vilkårskode);
}

export function getVilkårKodeverk(vilkårskode: string) {
    return vilkårskodeverk.find((v) => {
        const hjemmel = v.vilkårshjemmel;
        if (vilkårskode === 'MEDLEM_I_FOLKETRYGDEN') {
            return hjemmel.kapittel === '2' && hjemmel.paragraf === '1';
        }
        if (vilkårskode === 'OPPTJENING') {
            return hjemmel.kapittel === '8' && hjemmel.paragraf === '2';
        }
        return false;
    });
}

export function getVurderingStatus(vurderingskode: string | null | undefined, vilkårskode: string) {
    if (!vurderingskode) {
        return 'IkkeVurdert';
    }

    const kodeverk = getVilkårKodeverk(vilkårskode);
    if (!kodeverk) {
        return 'IkkeVurdert';
    }

    const isOppfylt = kodeverk.oppfylt.some((o) => o.kode === vurderingskode);
    const isIkkeOppfylt = kodeverk.ikkeOppfylt.some((io) => io.kode === vurderingskode);

    if (isOppfylt) {
        return 'Oppfylt';
    }
    if (isIkkeOppfylt) {
        return 'IkkeOppfylt';
    }

    return 'IkkeVurdert';
}

export function getVurdertAv(vurdering: VurderingType | undefined): string | undefined {
    if (!vurdering) {
        return undefined;
    }

    if (vurdering.type === 'MANUELL') {
        return vurdering.manuellVurdering?.navident;
    }

    if (vurdering.type === 'AUTOMATISK') {
        return 'Automatisk';
    }

    return undefined;
}

export function getVurdertDato(vurdering: VurderingType | undefined): string | undefined {
    if (!vurdering?.tidspunkt) {
        return undefined;
    }

    try {
        const date = new Date(vurdering.tidspunkt);
        return date.toLocaleDateString('nb-NO');
    } catch {
        return undefined;
    }
}

export function findVurderingForVilkår(
    vilkårskode: string,
    vurderinger: VurderingType[] | undefined,
): VurderingType | undefined {
    return vurderinger?.find((v) => v.vilkårskode === vilkårskode);
}
