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
import { useGetVilkårsvurderingerForPersonBehandler } from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { Vilkårsutfall, utfallFraOppfylt } from '@saksbilde/vilkår/vilkårsutfall';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
} from '@state/oppdateringToasts';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';

import { useInvaliderOpptjening } from './useInvaliderOpptjening';

export interface Opptjeningsvurdering {
    data?: ApiVilkårsvurderingerForPersonResponse;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    refetch: () => void;
    utfall: Vilkårsutfall;
    erOverførtFraInfotrygd: boolean;
    vurderingFor: (vilkårskode: ApiVilkårskode) => ApiVilkårsvurdering | undefined;
    avgjørendeVilkårskode?: ApiVilkårskode;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
    onVenterPåGrunnlag: () => void;
}

interface Overstyring {
    opptjeningsvurderingId: string;
    opptjeningsvurderingIdFørOverstyring: string;
}

export function useOpptjeningsvurdering(personPseudoId: string, opptjeningsvurderingId: string): Opptjeningsvurdering {
    const [overstyring, setOverstyring] = useState<Overstyring | null>(null);
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();
    const invaliderOpptjening = useInvaliderOpptjening(personPseudoId);

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            invaliderOpptjening();
        }
    });

    useFjernOppdatererToast(visningenOppdateres);

    // Overstyringen gjelder bare til spleis har en nyere opptjeningsvurderingId, f.eks. etter asynkron ny vurdering
    const gjeldendeOpptjeningsvurderingId =
        overstyring?.opptjeningsvurderingIdFørOverstyring === opptjeningsvurderingId
            ? overstyring.opptjeningsvurderingId
            : opptjeningsvurderingId;

    const { data, isLoading, isFetching, isError, refetch } = useGetVilkårsvurderingerForPersonBehandler(
        personPseudoId,
        {
            opptjeningsvurderingId: gjeldendeOpptjeningsvurderingId,
        },
    );

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
        refetch: () => void refetch(),
        utfall: utfallFraOppfylt(krav?.opptjeningOk),
        erOverførtFraInfotrygd: krav?.kravkilde === ApiKravkilde.OVERFOERT_FRA_INFOTRYGD,
        vurderingFor: (vilkårskode) => vurderinger.find((it) => it.vilkårskode === vilkårskode),
        avgjørendeVilkårskode: avgjørendeVilkårskodeFor(krav),
        onOverstyrt: (nyOpptjeningsvurderingId) => {
            setOverstyring({
                opptjeningsvurderingId: nyOpptjeningsvurderingId,
                opptjeningsvurderingIdFørOverstyring: opptjeningsvurderingId,
            });
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
