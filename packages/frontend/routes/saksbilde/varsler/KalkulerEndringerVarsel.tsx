import React, { useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { Alert, BodyShort, Button, Heading, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { Modal } from '@components/Modal';
import { TimeoutModal } from '@components/TimeoutModal';
import { OverstyrtInntektOgRefusjonDTO } from '@io/http';
import { inntektOgRefusjonState } from '@state/overstyring';

import { usePostOverstyrtInntektOgRefusjon } from './usePostOverstyrtInntektOgRefusjon';

import styles from './Saksbildevarsler.module.css';

interface KalkulerEndringerVarselProps {
    skjæringstidspunkt?: string;
}

export const KalkulerEndringerVarsel: React.FC<KalkulerEndringerVarselProps> = ({ skjæringstidspunkt }) => {
    const [lokaleInntektoverstyringer] = useRecoilState(inntektOgRefusjonState);
    const slettLokaleOverstyringer = useResetRecoilState(inntektOgRefusjonState);
    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntektOgRefusjon();
    const [showModal, setShowModal] = useState(false);
    const antallRedigerteArbeidsgivere = lokaleInntektoverstyringer?.arbeidsgivere.length ?? 0;

    return antallRedigerteArbeidsgivere > 0 && lokaleInntektoverstyringer?.skjæringstidspunkt === skjæringstidspunkt ? (
        <>
            <Alert className={styles.Varsel} variant="info">
                <BodyShort>
                    Endringene for sykepengegrunnlag må kalkuleres før du sender saken til godkjenning.
                </BodyShort>
                <div className={styles.Buttons}>
                    <Button
                        variant="primary"
                        size="small"
                        data-testid="kalkuler-button"
                        disabled={isLoading}
                        onClick={() => postOverstyring(lokaleInntektoverstyringer as OverstyrtInntektOgRefusjonDTO)}
                        className={styles.ButtonWithLoader}
                    >
                        Kalkuler endringer ({antallRedigerteArbeidsgivere}){isLoading && <Loader size="xsmall" />}
                    </Button>
                    <Button
                        variant="tertiary"
                        size="small"
                        data-testid="kalkuler-avbryt-button"
                        onClick={() => setShowModal(true)}
                    >
                        Forkast endringer ({antallRedigerteArbeidsgivere})
                    </Button>
                </div>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Alert>
            {timedOut && <TimeoutModal onRequestClose={() => setTimedOut(false)} />}
            {showModal && (
                <SlettLokaleOverstyringerModal
                    onApprove={() => {
                        slettLokaleOverstyringer();
                        setShowModal(false);
                    }}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    ) : null;
};

interface SlettLokaleOverstyringerModalProps {
    onApprove: () => void;
    onClose: () => void;
    heading?: string;
    tekst?: ReactNode;
}

export const SlettLokaleOverstyringerModal = ({
    onApprove,
    onClose,
    heading,
    tekst,
}: SlettLokaleOverstyringerModalProps) => (
    <Modal
        isOpen
        title={
            <Heading as="h2" size="large">
                {heading ?? 'Er du sikker på at du vil forkaste endringene?'}
            </Heading>
        }
        contentLabel="Slett lokale overstyringer"
        onRequestClose={onClose}
    >
        <div className={styles.Container}>
            {tekst ?? (
                <BodyShort>
                    Ved å trykke <span style={{ fontWeight: 'bold' }}>Ja</span> vil endringene ikke bli lagret.
                </BodyShort>
            )}
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
