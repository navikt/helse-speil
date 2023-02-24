import React, { useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { Alert, BodyShort, Button, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
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
    const slettLokaleEndringer = useResetRecoilState(inntektOgRefusjonState);
    const [isLoading, setIsLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>();
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (opptegnelser && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setIsLoading(false);
            setCalculating(false);
            slettLokaleEndringer();
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
    const slettLokaleEndringer = useResetRecoilState(inntektOgRefusjonState);
    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntektOgRefusjon();
    const antallRedigerteArbeidsgivere = lokaleInntektoverstyringer?.arbeidsgivere.length ?? 0;

    const cancelEditing = () => {
        // @TODO modal her med 'er du sikker på at du vil slette overstyringene du har gjort?'
        slettLokaleEndringer();
    };

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
                        onClick={cancelEditing}
                    >
                        Avbryt
                    </Button>
                </div>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Alert>
            {timedOut && <OverstyringTimeoutModal onRequestClose={() => setTimedOut(false)} />}
        </>
    ) : null;
};
