import React, { ReactElement } from 'react';

import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Dialog } from '@navikt/ds-react';

import {
    ApiNyAutomatiskVilkårsvurderingResponse,
    ApiNyAutomatiskVilkårsvurderingStatus,
} from '@io/rest/generated/vilkarsproving.schemas';
import {
    getGetVilkårsvurderingerForPersonBehandlerQueryKey,
    usePostNyAutomatiskVilkårsvurderingBehandler,
} from '@io/rest/generated/vilkarsvurderinger/vilkarsvurderinger';
import { sporHendelse } from '@observability/hendelser';
import { ToastObject, useAddToast } from '@state/toasts';
import { useVisningenOppdateresValue } from '@state/visningenOppdateres';
import { useQueryClient } from '@tanstack/react-query';
import { somNorskDato } from '@utils/date';
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
    const visningenOppdateres = useVisningenOppdateresValue();
    const { mutate, isPending } = usePostNyAutomatiskVilkårsvurderingBehandler();

    function håndterRespons({ status, opptjeningsvurderingId }: ApiNyAutomatiskVilkårsvurderingResponse) {
        sporHendelse({ name: 'opptjening vurdert automatisk på nytt', properties: { status } });
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

    function vurderPåNytt() {
        mutate(
            { personId: personPseudoId, data: { skjæringstidspunkt } },
            { onSuccess: håndterRespons, onError: () => addToast(feilVedNyVurderingToast) },
        );
    }

    return (
        <Dialog>
            <Dialog.Trigger>
                <Button
                    type="button"
                    size="xsmall"
                    variant="tertiary"
                    icon={<ArrowsCirclepathIcon />}
                    loading={isPending}
                    disabled={visningenOppdateres}
                >
                    Vurder automatisk på nytt
                </Button>
            </Dialog.Trigger>
            <Dialog.Popup>
                <Dialog.Header>
                    <Dialog.Title>Er du sikker?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    Opptjeningstid blir vurdert automatisk på nytt for skjæringstidspunkt{' '}
                    {somNorskDato(skjæringstidspunkt)}. <br /> Den nåværende vurderingen, også manuelle vurderinger,
                    blir erstattet.
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button type="button" variant="tertiary">
                            Avbryt
                        </Button>
                    </Dialog.CloseTrigger>
                    <Dialog.CloseTrigger>
                        <Button type="button" variant="primary" onClick={vurderPåNytt}>
                            Ja
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
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
