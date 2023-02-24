import React, { useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { Alert, BodyShort, Button, Heading, Loader } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { ErrorMessage } from '@components/ErrorMessage';
import { Modal } from '@components/Modal';
import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import { OverstyrtInntektOgRefusjonDTO, postAbonnerPåAktør, postOverstyrtInntektOgRefusjon } from '@io/http';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast, useRemoveToast } from '@state/toasts';

import { inntektOgRefusjonState } from '../sykepengegrunnlag/inntekt/EditableInntekt';

import styles from './Saksbildevarsler.module.css';

interface KalkulerEndringerVarselProps {
    skjæringstidspunkt?: string;
}

const usePostOverstyrtInntektOgRefusjon = () => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const opptegnelser = useOpptegnelser();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const slettLokaleOverstyringer = useResetRecoilState(inntektOgRefusjonState);
    const [isLoading, setIsLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>();
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (opptegnelser && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setIsLoading(false);
            setCalculating(false);
            slettLokaleOverstyringer();
        }
    }, [opptegnelser]);

    useEffect(() => {
        const timeout: NodeJS.Timeout | number | null = calculating
            ? setTimeout(() => {
                  setTimedOut(true);
              }, 15000)
            : null;
        return () => {
            !!timeout && clearTimeout(timeout);
        };
    }, [calculating]);

    useEffect(() => {
        return () => {
            calculating && removeToast(kalkulererToastKey);
        };
    }, [calculating]);

    return {
        isLoading,
        error,
        timedOut,
        setTimedOut,
        postOverstyring: (overstyrtInntekt: OverstyrtInntektOgRefusjonDTO) => {
            console.log(overstyrtInntekt);
            setIsLoading(true);

            postOverstyrtInntektOgRefusjon(overstyrtInntekt)
                .then(() => {
                    setCalculating(true);
                    addToast(kalkulererToast({}));
                    postAbonnerPåAktør(overstyrtInntekt.aktørId).then(() => setPollingRate(1000));
                })
                .catch((error) => {
                    switch (error.statusCode) {
                        default: {
                            setError('Kunne ikke overstyre inntekt og/eller refusjon. Prøv igjen senere.');
                        }
                    }
                    setIsLoading(false);
                });
        },
    };
};

export const KalkulerEndringerVarsel: React.FC<KalkulerEndringerVarselProps> = ({ skjæringstidspunkt }) => {
    const [lokaleInntektoverstyringer] = useRecoilState(inntektOgRefusjonState);
    const slettLokaleOverstyringer = useResetRecoilState(inntektOgRefusjonState);
    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntektOgRefusjon();
    const [showModal, setShowModal] = useState(false);
    const antallRedigerteArbeidsgivere = lokaleInntektoverstyringer?.arbeidsgivere.length ?? 0;

    return antallRedigerteArbeidsgivere > 0 && lokaleInntektoverstyringer?.skjæringstidspunkt === skjæringstidspunkt ? (
        <>
            <Alert className={styles.Varsel} variant="info">
                <BodyShort>Endringene må kalkuleres før du sender saken til godkjenning.</BodyShort>
                <div className={styles.Buttons}>
                    <Button
                        variant="primary"
                        size="small"
                        data-testid="kalkuler-button"
                        disabled={isLoading}
                        onClick={() => postOverstyring(lokaleInntektoverstyringer as OverstyrtInntektOgRefusjonDTO)}
                    >
                        Kalkuler endringer ({antallRedigerteArbeidsgivere}){isLoading && <Loader size="xsmall" />}
                    </Button>
                    <Button
                        variant="tertiary"
                        size="small"
                        data-testid="kalkuler-avbryt-button"
                        onClick={() => setShowModal(true)}
                    >
                        Avbryt
                    </Button>
                </div>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Alert>
            {timedOut && <OverstyringTimeoutModal onRequestClose={() => setTimedOut(false)} />}
            {showModal && (
                <SlettLokaleOverstyringerModal
                    onApprove={() => slettLokaleOverstyringer()}
                    onClose={() => setShowModal(false)}
                    skjæringstidspunkt={skjæringstidspunkt}
                />
            )}
        </>
    ) : null;
};

interface SlettLokaleOverstyringerModalProps {
    onApprove: () => void;
    onClose: () => void;
    skjæringstidspunkt: string;
}

export const SlettLokaleOverstyringerModal = ({
    onApprove,
    onClose,
    skjæringstidspunkt,
}: SlettLokaleOverstyringerModalProps) => (
    <Modal
        isOpen
        title={
            <Heading as="h2" size="large">
                Er du sikker på at du vil avbryte?
            </Heading>
        }
        contentLabel="Slett lokale overstyringer"
        onRequestClose={onClose}
    >
        <div className={styles.Container}>
            <BodyShort>
                Ved å trykke ja slettes lokale overstyringer lagret på skjæringstidspunkt:{' '}
                <Bold>{skjæringstidspunkt}</Bold>
            </BodyShort>
            <div className={styles.Buttons}>
                <Button variant="primary" onClick={onApprove}>
                    <span>Ja</span>
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Avbryt
                </Button>
            </div>
        </div>
    </Modal>
);
