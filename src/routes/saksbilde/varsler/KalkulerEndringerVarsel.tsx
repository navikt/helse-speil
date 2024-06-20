import React, { ReactElement, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { Alert, BodyShort, Button, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { SlettLokaleEndringerModal } from '@components/SlettLokaleEndringerModal';
import { TimeoutModal } from '@components/TimeoutModal';
import { Maybe } from '@io/graphql';
import { inntektOgRefusjonState } from '@state/overstyring';
import { OverstyrtInntektOgRefusjonDTO } from '@typer/overstyring';

import { usePostOverstyrtInntektOgRefusjon } from './usePostOverstyrtInntektOgRefusjon';

import styles from './Saksbildevarsler.module.css';

interface KalkulerEndringerVarselProps {
    skjæringstidspunkt?: string;
}

export const KalkulerEndringerVarsel = ({ skjæringstidspunkt }: KalkulerEndringerVarselProps): Maybe<ReactElement> => {
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
            {timedOut && <TimeoutModal showModal={timedOut} onClose={() => setTimedOut(false)} />}
            {showModal && (
                <SlettLokaleEndringerModal
                    heading="Er du sikker på at du vil forkaste endringene?"
                    showModal={showModal}
                    onApprove={() => {
                        slettLokaleOverstyringer();
                        setShowModal(false);
                    }}
                    onClose={() => setShowModal(false)}
                >
                    <BodyShort>
                        Ved å trykke <span style={{ fontWeight: 'bold' }}>Ja</span> vil endringene ikke bli lagret.
                    </BodyShort>
                </SlettLokaleEndringerModal>
            )}
        </>
    ) : null;
};
