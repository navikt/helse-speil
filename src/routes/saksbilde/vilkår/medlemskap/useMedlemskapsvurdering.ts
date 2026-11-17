import { useState } from 'react';

import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import {
    ApiKildetype,
    ApiMedlemskapsstatus,
    ApiMedlemskapsvurdering,
    ApiVilkårsvurderingerForPersonResponse,
} from '@io/rest/generated/medlemskap/medlemskap.schemas';
import {
    getGetMedlemskapshistorikkBehandlerQueryKey,
    getGetVilkårsvurderingerForPersonBehandlerQueryKey,
    useGetVilkårsvurderingerForPersonBehandler,
} from '@io/rest/generated/medlemskap/vilkarsvurderinger/vilkarsvurderinger';
import { Vilkårsutfall } from '@saksbilde/vilkår/vilkårsutfall';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
} from '@state/oppdateringToasts';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
import { useQueryClient } from '@tanstack/react-query';

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

export function useMedlemskapsvurdering(personPseudoId: string, medlemskapsvurderingId: string): Medlemskapsvurdering {
    const [overstyring, setOverstyring] = useState<Overstyring | null>(null);
    const queryClient = useQueryClient();
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            void queryClient.invalidateQueries({
                queryKey: getGetVilkårsvurderingerForPersonBehandlerQueryKey(personPseudoId),
            });
            void queryClient.invalidateQueries({
                queryKey: getGetMedlemskapshistorikkBehandlerQueryKey(personPseudoId),
            });
        }
    });

    useFjernOppdatererToast(visningenOppdateres);

    // Spleis lytter ikke på endrede medlemskapsvurderinger ennå, så vilkårsgrunnlaget beholder den gamle id-en.
    // Vi viser derfor den nye vurderingen til grunnlaget får en annen id.
    const gjeldendeMedlemskapsvurderingId =
        overstyring !== null && overstyring.medlemskapsvurderingIdFørOverstyring === medlemskapsvurderingId
            ? overstyring.medlemskapsvurderingId
            : medlemskapsvurderingId;

    const { data, isLoading, isError, refetch } = useGetVilkårsvurderingerForPersonBehandler(personPseudoId, {
        medlemskapsvurderingId: gjeldendeMedlemskapsvurderingId,
    });

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
            setOverstyring({
                medlemskapsvurderingId: nyMedlemskapsvurderingId,
                medlemskapsvurderingIdFørOverstyring: medlemskapsvurderingId,
            });
            setVisningenOppdateres(true);
            addToast(visningenOppdateresToast({}));
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

const medlemskapsutfalltekster: Record<ApiMedlemskapsstatus, string> = {
    [ApiMedlemskapsstatus.JA]: 'Oppfylt',
    [ApiMedlemskapsstatus.NEI]: 'Ikke oppfylt',
    [ApiMedlemskapsstatus.UAVKLART]: 'Ikke vurdert',
    [ApiMedlemskapsstatus.UAVKLART_MED_BRUKERSPORSMAAL]: 'Må vurderes',
};

export function medlemskapsutfalltekst(status: ApiMedlemskapsstatus): string {
    return medlemskapsutfalltekster[status];
}
