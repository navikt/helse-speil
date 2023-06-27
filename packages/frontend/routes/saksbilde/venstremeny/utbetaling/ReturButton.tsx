import { nanoid } from 'nanoid';
import React, { useContext, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { AmplitudeContext } from '@io/amplitude';
import { NotatType, Personnavn } from '@io/graphql';
import { postSendTilbakeTilSaksbehandler } from '@io/http';
import { useCurrentPerson } from '@state/person';
import { useAddToast } from '@state/toasts';

import { NyttNotatModal } from '../../../oversikt/table/cells/notat/NyttNotatModal';

const useAddReturtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Saken er sendt i retur til saksbehandler',
            timeToLiveMs: 5000,
            key: nanoid(),
            variant: 'success',
        });
    };
};

interface ReturButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'children'> {
    activePeriod: FetchedBeregnetPeriode;
    disabled: boolean;
    onSuccess?: () => void;
}

export const ReturButton: React.FC<ReturButtonProps> = ({
    activePeriod,
    disabled = false,
    onSuccess,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const addReturtoast = useAddReturtoast();
    const person = useCurrentPerson();
    const amplitude = useContext(AmplitudeContext);

    const closeModal = () => {
        setError(undefined);
        setShowModal(false);
    };

    if (!person) {
        return null;
    }
    const personinfo = person.personinfo;

    const navn: Personnavn = {
        fornavn: personinfo.fornavn,
        mellomnavn: personinfo.mellomnavn,
        etternavn: personinfo.etternavn,
    };

    const returnerUtbetaling = (notattekst: string) => {
        setError(undefined);

        return postSendTilbakeTilSaksbehandler(activePeriod.oppgave?.id ?? '', {
            tekst: notattekst,
            type: 'Retur',
        })
            .then(() => {
                amplitude.logTotrinnsoppgaveReturnert();
                addReturtoast();
                closeModal();
                onSuccess?.();
            })
            .catch((error) => {
                setError(
                    error.statusCode === 401 ? 'Du har blitt logget ut' : 'En feil oppsto, saken kunne ikke returneres',
                );
            });
    };

    return (
        <>
            <Button
                disabled={disabled}
                variant="secondary"
                size="small"
                data-testid="retur-button"
                onClick={() => setShowModal(true)}
                {...buttonProps}
            >
                Returner
            </Button>
            {showModal && (
                <NyttNotatModal
                    onClose={() => {
                        setError(undefined);
                        setShowModal(false);
                    }}
                    navn={navn}
                    vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                    onSubmitOverride={returnerUtbetaling}
                    errorOverride={error}
                    notattype={NotatType.Retur}
                />
            )}
        </>
    );
};
