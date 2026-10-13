import React, { ReactElement } from 'react';

import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import {
    ApiNyAutomatiskVilkårsvurderingResponse,
    ApiNyAutomatiskVilkårsvurderingStatus,
} from '@io/rest/generated/vilkarsproving.schemas';
import {
    getGetVilkårsvurderingerForPersonBehandlerQueryKey,
    usePostNyAutomatiskVilkårsvurderingBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { ToastObject, useAddToast } from '@state/toasts';
import { useQueryClient } from '@tanstack/react-query';
import { generateId } from '@utils/generateId';

interface VurderAutomatiskPåNyttKnappProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
    onVurdert: (opptjeningsvurderingId: string) => void;
    onVenterPåGrunnlag: () => void;
}

export function VurderAutomatiskPåNyttKnapp({
    personPseudoId,
    skjæringstidspunkt,
    onVurdert,
    onVenterPåGrunnlag,
}: VurderAutomatiskPåNyttKnappProps): ReactElement {
    const queryClient = useQueryClient();
    const addToast = useAddToast();
    const { mutate, isPending } = usePostNyAutomatiskVilkårsvurderingBehandler();

    function håndterRespons({ status, opptjeningsvurderingId }: ApiNyAutomatiskVilkårsvurderingResponse) {
        if (status === ApiNyAutomatiskVilkårsvurderingStatus.VURDERT && opptjeningsvurderingId) {
            void queryClient.invalidateQueries({
                queryKey: getGetVilkårsvurderingerForPersonBehandlerQueryKey(personPseudoId),
            });
            onVurdert(opptjeningsvurderingId);
        } else {
            onVenterPåGrunnlag();
            addToast(venterPåGrunnlagToast);
        }
    }

    return (
        <Button
            type="button"
            size="xsmall"
            variant="tertiary"
            icon={<ArrowsCirclepathIcon />}
            loading={isPending}
            onClick={() =>
                mutate(
                    { personId: personPseudoId, data: { skjæringstidspunkt } },
                    { onSuccess: håndterRespons, onError: () => addToast(feilVedNyVurderingToast) },
                )
            }
        >
            Vurder automatisk på nytt
        </Button>
    );
}

const venterPåGrunnlagToast: ToastObject = {
    key: generateId(),
    message: 'Venter på grunnlag. Opptjeningstid vurderes automatisk når grunnlaget er hentet.',
    timeToLiveMs: 5000,
};

const feilVedNyVurderingToast: ToastObject = {
    key: generateId(),
    message: 'Kunne ikke vurdere opptjeningstid automatisk på nytt',
    variant: 'error',
    timeToLiveMs: 10000,
};
