// @ts-ignore
import { nanoid } from 'nanoid';
import React, { ReactNode, useContext, useState } from 'react';

import { Alert, BodyShort, Button } from '@navikt/ds-react';

import { Key, useKeyboard } from '@hooks/useKeyboard';
import { AmplitudeContext } from '@io/amplitude';
import { NotatType, Personinfo, Personnavn, Utbetaling } from '@io/graphql';
import { postNotat, postUtbetalingTilTotrinnsvurdering } from '@io/http';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useAddToast } from '@state/toasts';
import { isBeregnetPeriode, isPerson } from '@utils/typeguards';

import { NyttNotatModal } from '../../../oversikt/table/rader/notat/NyttNotatModal';
import { BackendFeil } from './Utbetaling';
import { UtbetalingModal } from './UtbetalingModal';

import styles from './SendTilGodkjenningButton.module.css';

const useAddSendtTilGodkjenningtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Saken er sendt til beslutter',
            timeToLiveMs: 5000,
            key: nanoid(),
            variant: 'success',
        });
    };
};

interface SendTilGodkjenningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError'> {
    children: ReactNode;
    oppgavereferanse: string;
    manglerNotatVedVurderLovvalgOgMedlemskapVarsel?: boolean;
    disabled: boolean;
    onSuccess?: () => void;
    utbetaling: Utbetaling;
    arbeidsgiver: string;
    personinfo: Personinfo;
}

export const SendTilGodkjenningButton: React.FC<SendTilGodkjenningButtonProps> = ({
    children,
    oppgavereferanse,
    manglerNotatVedVurderLovvalgOgMedlemskapVarsel,
    disabled = false,
    onSuccess,
    utbetaling,
    arbeidsgiver,
    personinfo,
    ...buttonProps
}) => {
    const [showModal, setShowModal] = useState(false);
    const [showGenereltNotatModal, setShowGenereltNotatModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<BackendFeil | undefined>();
    const amplitude = useContext(AmplitudeContext);
    const addToast = useAddSendtTilGodkjenningtoast();
    const activePeriod = useActivePeriod();
    const person = useCurrentPerson();

    const navn: Personnavn = {
        fornavn: personinfo.fornavn,
        mellomnavn: personinfo.mellomnavn,
        etternavn: personinfo.etternavn,
    };

    useKeyboard({
        [Key.F6]: {
            action: () =>
                manglerNotatVedVurderLovvalgOgMedlemskapVarsel ? setShowGenereltNotatModal(true) : setShowModal(true),
            ignoreIfModifiers: false,
        },
    });

    if (!isPerson(person) || !isBeregnetPeriode(activePeriod)) {
        return null;
    }

    const closeModal = () => {
        setError(undefined);
        setShowModal(false);
    };
    const closeGenereltNotatModal = () => setShowGenereltNotatModal(false);

    const postNotatOgSendTilGodkjenning = (notattekst: string) => {
        setError(undefined);
        setIsSending(true);
        return postNotat(activePeriod.vedtaksperiodeId, { tekst: notattekst, type: NotatType.Generelt })
            .then(() => {
                sendTilGodkjenning();
            })
            .catch((error) => {
                setIsSending(false);
                setError(error);
            });
    };

    const sendTilGodkjenning = () => {
        setIsSending(true);
        postUtbetalingTilTotrinnsvurdering(oppgavereferanse)
            .then(() => {
                amplitude.logTotrinnsoppgaveTilGodkjenning();
                addToast();
                onSuccess?.();
                closeModal();
            })
            .catch((error) => {
                if (error.statusCode === 409) {
                    setError({ ...error, message: 'Saken er allerede utbetalt.' });
                } else setError(error);
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    return (
        <>
            <Button
                disabled={disabled}
                variant="primary"
                size="small"
                data-testid="godkjenning-button"
                onClick={() =>
                    manglerNotatVedVurderLovvalgOgMedlemskapVarsel
                        ? setShowGenereltNotatModal(true)
                        : setShowModal(true)
                }
                {...buttonProps}
            >
                {children}
            </Button>
            {showModal && (
                <UtbetalingModal
                    utbetaling={utbetaling}
                    arbeidsgiver={arbeidsgiver}
                    personinfo={personinfo}
                    onClose={closeModal}
                    onApprove={sendTilGodkjenning}
                    error={error}
                    isSending={isSending}
                    totrinnsvurdering={true}
                />
            )}
            {showGenereltNotatModal && (
                <NyttNotatModal
                    onClose={closeGenereltNotatModal}
                    navn={navn}
                    vedtaksperiodeId={activePeriod.vedtaksperiodeId}
                    notattype="Generelt"
                    onSubmitOverride={postNotatOgSendTilGodkjenning}
                    ekstraInnhold={
                        <Alert className={styles.ManglerLovvalgOgMedlemskapNotat} variant="warning">
                            <BodyShort className={styles.NotatParagraf}>
                                Du må skrive notat for lovvalg og medlemskap før oppgaven kan sendes til beslutter.
                            </BodyShort>
                        </Alert>
                    }
                    submitButtonText="Lagre og send"
                />
            )}
        </>
    );
};
