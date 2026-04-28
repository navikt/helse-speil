import React, { ReactElement, useState } from 'react';

import { Button, ErrorMessage } from '@navikt/ds-react';

import { UberegnetPeriodeFragment } from '@io/graphql';
import { ApiServerSentEvent } from '@io/rest/generated/spesialist.schemas';
import { usePostAnmodOmForkasting } from '@io/rest/generated/vedtaksperioder/vedtaksperioder';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
    visningenOppdateresToastKey,
} from '@state/oppdateringToasts';
import { erPersondataOppdatertEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';

interface ForkastFraUberegnetButtonProps {
    activePeriod: UberegnetPeriodeFragment;
}

export const ForkastFraUberegnetButton = ({ activePeriod }: ForkastFraUberegnetButtonProps): ReactElement => {
    const { mutate, error, isPending } = usePostAnmodOmForkasting();
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const [forkastingAnmodet, setForkastingAnmodet] = useState(false);

    const submit = () => {
        addToast(visningenOppdateresToast({}));
        mutate(
            {
                vedtaksperiodeId: activePeriod.vedtaksperiodeId,
            },
            {
                onSuccess: () => setForkastingAnmodet(true),
                onError: () => removeToast(visningenOppdateresToastKey),
            },
        );
    };

    const håndterPersondataOppdatert = (event: ApiServerSentEvent) => {
        if (erPersondataOppdatertEvent(event) && forkastingAnmodet) {
            removeToast(visningenOppdateresToastKey);
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setForkastingAnmodet(false);
        }
    };

    useHåndterNyttEvent(håndterPersondataOppdatert);

    return (
        <>
            <Button variant="secondary" disabled={isPending || forkastingAnmodet} size="small" onClick={submit}>
                Kan ikke behandles her
            </Button>
            {error && (
                <ErrorMessage className="px-6 pb-4">
                    En feil har oppstått, prøv igjen eller meld feil.
                    <br />
                    Teknisk feilkode: {error.status}
                </ErrorMessage>
            )}
        </>
    );
};
