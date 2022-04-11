import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import classNames from 'classnames';

import { BodyShort, Button, ErrorSummary, ErrorSummaryItem, Loader } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { ErrorMessage } from '@components/ErrorMessage';
import { Flex, FlexColumn } from '@components/Flex';
import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import type { OverstyrtInntektDTO } from '@io/http';
import { postAbonnerPåAktør, postOverstyrtInntekt } from '@io/http';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { somPenger, toKronerOgØre } from '@utils/locale';

import { Begrunnelser } from './Begrunnelser';
import { ForklaringTextarea } from './ForklaringTextarea';
import { MånedsbeløpInput } from './MånedsbeløpInput';
import { Inntektskilde, OmregnetArsinntekt } from '@io/graphql';
import { useCurrentPerson } from '@state/person';
import { useActivePeriod } from '@state/periode';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { isArbeidsgiver, isBeregnetPeriode, isPerson } from '@utils/typeguards';
import { Bold } from '@components/Bold';

import styles from './EditableInntekt.module.css';

type OverstyrtInntektMetadata = {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
};

const useOverstyrtInntektMetadata = (): OverstyrtInntektMetadata => {
    const person = useCurrentPerson();
    const period = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!isPerson(person) || !isArbeidsgiver(arbeidsgiver) || !isBeregnetPeriode(period)) {
        throw Error('Mangler data for å kunne overstyre inntekt.');
    }

    return {
        aktørId: person.aktorId,
        fødselsnummer: person.fodselsnummer,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
        skjæringstidspunkt: period.skjaeringstidspunkt,
    };
};

const usePostOverstyrtInntekt = (onFerdigKalkulert: () => void) => {
    const person = useCurrentPerson();

    if (!isPerson(person)) {
        throw Error('Mangler persondata.');
    }

    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const opptegnelser = useOpptegnelser();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [isLoading, setIsLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>();
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (opptegnelser && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setIsLoading(false);
            setCalculating(false);
            onFerdigKalkulert();
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
        postOverstyring: (overstyrtInntekt: OverstyrtInntektDTO) => {
            setIsLoading(true);
            postOverstyrtInntekt(overstyrtInntekt)
                .then(() => {
                    setCalculating(true);
                    addToast(kalkulererToast({}));
                    postAbonnerPåAktør(person.aktorId).then(() => setPollingRate(1000));
                })
                .catch((error) => {
                    switch (error.statusCode) {
                        default: {
                            setError('Kunne ikke overstyre inntekt. Prøv igjen senere. ');
                        }
                    }
                    setIsLoading(false);
                });
        },
    };
};

interface EditableInntektProps {
    omregnetÅrsinntekt: OmregnetArsinntekt;
    close: () => void;
    onEndre: (erEndret: boolean) => void;
}

export const EditableInntekt = ({ omregnetÅrsinntekt, close, onEndre }: EditableInntektProps) => {
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const metadata = useOverstyrtInntektMetadata();

    const cancelEditing = () => {
        onEndre(false);
        close();
    };

    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntekt(cancelEditing);

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;
    const values = form.getValues();

    const månedsbeløp = Number.parseFloat(values.manedsbelop);
    const harEndringer = !isNaN(månedsbeløp) && månedsbeløp !== omregnetÅrsinntekt.manedsbelop;

    useEffect(() => {
        if (!isNaN(values.manedsbelop)) {
            onEndre(Number.parseFloat(values.manedsbelop) !== omregnetÅrsinntekt.manedsbelop);
        }
    }, [values, omregnetÅrsinntekt]);

    useEffect(() => {
        harFeil && feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    const confirmChanges = () => {
        const { begrunnelse, forklaring, manedsbelop } = form.getValues();
        const overstyrtInntekt = {
            ...metadata,
            begrunnelse,
            forklaring,
            månedligInntekt: Number.parseFloat(manedsbelop),
        };
        postOverstyring(overstyrtInntekt);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.EditableInntekt}>
                    <div className={styles.Grid}>
                        <BodyShort>Månedsbeløp</BodyShort>
                        <Flex gap="1rem">
                            <FlexColumn>
                                <MånedsbeløpInput initialMånedsbeløp={omregnetÅrsinntekt.manedsbelop} />
                            </FlexColumn>
                            <p
                                className={classNames(
                                    styles.OpprinneligMånedsbeløp,
                                    harEndringer && styles.harEndringer,
                                )}
                            >
                                {toKronerOgØre(omregnetÅrsinntekt.manedsbelop)}
                            </p>
                        </Flex>
                    </div>
                    <BodyShort className={styles.Warning}>Endringen vil gjelde fra skjæringstidspunktet</BodyShort>
                    <div
                        className={classNames(
                            styles.Grid,
                            styles.OmregnetTilÅrsinntekt,
                            harEndringer && styles.harEndringer,
                        )}
                    >
                        <BodyShort>
                            {omregnetÅrsinntekt?.kilde === Inntektskilde.Infotrygd
                                ? 'Sykepengegrunnlag før 6G'
                                : 'Omregnet til årsinntekt'}
                        </BodyShort>
                        <div>
                            {harEndringer && <Endringstrekant />}
                            <Bold>{somPenger(omregnetÅrsinntekt.belop)}</Bold>
                        </div>
                    </div>
                    <Begrunnelser />
                    <ForklaringTextarea />
                    {!form.formState.isValid && form.formState.isSubmitted && (
                        <div className={styles.Feiloppsummering}>
                            <ErrorSummary ref={feiloppsummeringRef} heading="Skjemaet inneholder følgende feil:">
                                {Object.entries(form.formState.errors).map(([id, error]) => (
                                    <ErrorSummaryItem key={id}>{error.message}</ErrorSummaryItem>
                                ))}
                            </ErrorSummary>
                        </div>
                    )}
                    <span className={styles.Buttons}>
                        <Button className={styles.Button} disabled={isLoading} variant="secondary">
                            Ferdig
                            {isLoading && <Loader size="xsmall" />}
                        </Button>
                        <Button className={styles.Button} variant="tertiary" onClick={cancelEditing}>
                            Avbryt
                        </Button>
                    </span>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {timedOut && <OverstyringTimeoutModal onRequestClose={() => setTimedOut(false)} />}
                </div>
            </form>
        </FormProvider>
    );
};
