import React, { useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';

import { Alert, BodyShort, Button, Heading, Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@components/ErrorMessage';
import { Modal } from '@components/Modal';
import { TimeoutModal } from '@components/TimeoutModal';
import {
    InntektOgRefusjonOverstyringInput,
    OverstyrInntektOgRefusjonMutationDocument,
    OverstyringArbeidsgiverInput,
} from '@io/graphql';
import { OverstyrtInntektOgRefusjonDTO, postAbonnerPåAktør } from '@io/http';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { inntektOgRefusjonState } from '@state/overstyring';
import { useAddToast, useRemoveToast } from '@state/toasts';

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

    const [overstyrMutation] = useMutation(OverstyrInntektOgRefusjonMutationDocument);

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
            setIsLoading(true);

            const overstyring: InntektOgRefusjonOverstyringInput = {
                aktorId: overstyrtInntekt.aktørId,
                arbeidsgivere: overstyrtInntekt.arbeidsgivere.map(
                    (arbeidsgiver): OverstyringArbeidsgiverInput => ({
                        begrunnelse: arbeidsgiver.begrunnelse,
                        forklaring: arbeidsgiver.forklaring,
                        fraManedligInntekt: arbeidsgiver.fraMånedligInntekt,
                        manedligInntekt: arbeidsgiver.månedligInntekt,
                        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                        fraRefusjonsopplysninger: arbeidsgiver.fraRefusjonsopplysninger.map((refusjon) => ({
                            fom: refusjon.fom,
                            tom: refusjon.tom,
                            belop: refusjon.beløp,
                        })),
                        refusjonsopplysninger: arbeidsgiver.refusjonsopplysninger.map((refusjon) => ({
                            fom: refusjon.fom,
                            tom: refusjon.tom,
                            belop: refusjon.beløp,
                        })),
                        lovhjemmel:
                            arbeidsgiver.subsumsjon !== undefined
                                ? {
                                      bokstav: arbeidsgiver.subsumsjon.bokstav,
                                      ledd: arbeidsgiver.subsumsjon.ledd,
                                      paragraf: arbeidsgiver.subsumsjon.paragraf,
                                      lovverk: arbeidsgiver.subsumsjon.lovverk,
                                      lovverksversjon: arbeidsgiver.subsumsjon.lovverksversjon,
                                  }
                                : undefined,
                    }),
                ),
                fodselsnummer: overstyrtInntekt.fødselsnummer,
                skjaringstidspunkt: overstyrtInntekt.skjæringstidspunkt,
            };
            overstyrMutation({ variables: { overstyring: overstyring } })
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
