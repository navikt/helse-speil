import { useState } from 'react';

import {
    ApiKravkode,
    ApiOpptjeningsvurdering,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';

export type Opptjeningsstatus = 'IkkeVurdert' | 'VurdertOk' | 'VurdertIkkeOk';

export interface Opptjeningsvurdering {
    data?: ApiVilkårsvurderingerForPersonResponse;
    isLoading: boolean;
    isError: boolean;
    status: Opptjeningsstatus;
    vurderingFor: (vilkårskode: ApiVilkårskode) => ApiVilkårsvurdering | undefined;
    avgjørendeVilkårskode?: ApiVilkårskode;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
}

export function useOpptjeningsvurdering(personPseudoId: string, opptjeningsvurderingId: string): Opptjeningsvurdering {
    const [overstyrtOpptjeningsvurderingId, setOverstyrtOpptjeningsvurderingId] = useState<string | null>(null);

    const { data, isLoading, isError } = useGetVilkårsvurderingerForPersonBehandler(personPseudoId, {
        opptjeningsvurderingId: overstyrtOpptjeningsvurderingId ?? opptjeningsvurderingId,
    });

    const krav = data && finnOpptjeningskrav(data);
    const vurderinger = vurderingerFor(krav);

    return {
        data,
        isLoading,
        isError,
        status: krav === undefined ? 'IkkeVurdert' : krav.opptjeningOk ? 'VurdertOk' : 'VurdertIkkeOk',
        vurderingFor: (vilkårskode) => vurderinger.find((it) => it.vilkårskode === vilkårskode),
        avgjørendeVilkårskode: avgjørendeVilkårskodeFor(krav),
        onOverstyrt: setOverstyrtOpptjeningsvurderingId,
    };
}

function finnOpptjeningskrav(data: ApiVilkårsvurderingerForPersonResponse): ApiOpptjeningsvurdering | undefined {
    return data.krav.find((krav) => krav.kravkode === ApiKravkode.OPPTJENING);
}

function vurderingerFor(krav?: ApiOpptjeningsvurdering): ApiVilkårsvurdering[] {
    return krav && 'vurderinger' in krav ? krav.vurderinger : [];
}

function avgjørendeVilkårskodeFor(krav?: ApiOpptjeningsvurdering): ApiVilkårskode | undefined {
    return krav && 'avgjørendeVilkårskode' in krav ? (krav.avgjørendeVilkårskode ?? undefined) : undefined;
}
