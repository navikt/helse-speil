import { useState } from 'react';

import {
    ApiKildetype,
    ApiMedlemskapsstatus,
    ApiMedlemskapsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger';
import { Vilkårsutfall } from '@saksbilde/vilkår/vilkårsutfall';

export interface Medlemskapsvurdering {
    data?: ApiVilkårsvurderingerForPersonResponse;
    vurdering?: ApiMedlemskapsvurdering;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
    utfall: Vilkårsutfall;
    erOverførtFraInfotrygd: boolean;
    onOverstyrt: (medlemskapsvurderingId: string) => void;
}

interface Overstyring {
    medlemskapsvurderingId: string;
    medlemskapsvurderingIdFørOverstyring: string;
}

export function useMedlemskapsvurdering(
    personPseudoId: string,
    medlemskapsvurderingId: string | null | undefined,
    enabled: boolean,
): Medlemskapsvurdering {
    const [overstyring, setOverstyring] = useState<Overstyring | null>(null);

    // Spleis lytter ikke på endrede medlemskapsvurderinger ennå, så vilkårsgrunnlaget beholder den gamle id-en.
    // Vi viser derfor den nye vurderingen til grunnlaget får en annen id.
    const gjeldendeMedlemskapsvurderingId =
        overstyring !== null && overstyring.medlemskapsvurderingIdFørOverstyring === medlemskapsvurderingId
            ? overstyring.medlemskapsvurderingId
            : medlemskapsvurderingId;

    const { data, isLoading, isError, refetch } = useGetVilkårsvurderingerForPersonBehandler(
        personPseudoId,
        { medlemskapsvurderingId: gjeldendeMedlemskapsvurderingId ?? '' },
        { query: { enabled: enabled && !!gjeldendeMedlemskapsvurderingId } },
    );

    const vurdering = data?.krav[0];

    return {
        data,
        vurdering,
        isLoading,
        isError,
        refetch: () => void refetch(),
        utfall: utfallFraStatus(vurdering?.status),
        erOverførtFraInfotrygd: vurdering?.kilde.kildetype === ApiKildetype.OVERFOERT_FRA_INFOTRYGD,
        onOverstyrt: (nyMedlemskapsvurderingId) => {
            if (!medlemskapsvurderingId) return;
            setOverstyring({
                medlemskapsvurderingId: nyMedlemskapsvurderingId,
                medlemskapsvurderingIdFørOverstyring: medlemskapsvurderingId,
            });
        },
    };
}

export function utfallFraStatus(status?: ApiMedlemskapsstatus): Vilkårsutfall {
    switch (status) {
        case ApiMedlemskapsstatus.JA:
            return 'Oppfylt';
        case ApiMedlemskapsstatus.NEI:
            return 'IkkeOppfylt';
        default:
            return 'IkkeVurdert';
    }
}

export function statustekst(status: ApiMedlemskapsstatus): string {
    switch (status) {
        case ApiMedlemskapsstatus.JA:
            return 'Medlem';
        case ApiMedlemskapsstatus.NEI:
            return 'Ikke medlem';
        case ApiMedlemskapsstatus.UAVKLART:
            return 'Uavklart';
        case ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL:
            return 'Uavklart med brukerspørsmål';
    }
}
