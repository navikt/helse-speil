import { useState } from 'react';

import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import {
    ApiKravkilde,
    ApiKravkode,
    ApiOpptjeningsvurdering,
    ApiVilkårskode,
    ApiVilkårsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/vilkarsproving.schemas';
import {
    getGetOpptjeningshistorikkBehandlerQueryKey,
    useGetVilkårsvurderingerForPersonBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { Vilkårsutfall, utfallFraOppfylt } from '@saksbilde/vilkår/vilkårsutfall';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
} from '@state/oppdateringToasts';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
import { useQueryClient } from '@tanstack/react-query';

export interface Opptjeningsvurdering {
    data?: ApiVilkårsvurderingerForPersonResponse;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    utfall: Vilkårsutfall;
    erOverførtFraInfotrygd: boolean;
    vurderingFor: (vilkårskode: ApiVilkårskode) => ApiVilkårsvurdering | undefined;
    avgjørendeVilkårskode?: ApiVilkårskode;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
    onVenterPåGrunnlag: () => void;
}

export function useOpptjeningsvurdering(personPseudoId: string, opptjeningsvurderingId: string): Opptjeningsvurdering {
    const [overstyrtOpptjeningsvurderingId, setOverstyrtOpptjeningsvurderingId] = useState<string | null>(null);
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();
    const queryClient = useQueryClient();

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            void queryClient.invalidateQueries({
                queryKey: getGetOpptjeningshistorikkBehandlerQueryKey(personPseudoId),
            });
        }
    });

    useFjernOppdatererToast(visningenOppdateres);

    const { data, isLoading, isFetching, isError } = useGetVilkårsvurderingerForPersonBehandler(personPseudoId, {
        opptjeningsvurderingId: overstyrtOpptjeningsvurderingId ?? opptjeningsvurderingId,
    });

    const krav = data && finnOpptjeningskrav(data);
    const vurderinger = vurderingerFor(krav);

    function onVenterPåGrunnlag() {
        setVisningenOppdateres(true);
        addToast(visningenOppdateresToast({}));
    }

    return {
        data,
        isLoading,
        isFetching,
        isError,
        utfall: utfallFraOppfylt(krav?.opptjeningOk),
        erOverførtFraInfotrygd: krav?.kravkilde === ApiKravkilde.OVERFOERT_FRA_INFOTRYGD,
        vurderingFor: (vilkårskode) => vurderinger.find((it) => it.vilkårskode === vilkårskode),
        avgjørendeVilkårskode: avgjørendeVilkårskodeFor(krav),
        onOverstyrt: (opptjeningsvurderingId) => {
            setOverstyrtOpptjeningsvurderingId(opptjeningsvurderingId);
            onVenterPåGrunnlag();
        },
        onVenterPåGrunnlag,
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
