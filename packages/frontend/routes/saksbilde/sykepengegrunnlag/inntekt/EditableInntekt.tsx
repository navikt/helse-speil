import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { BodyShort, Button as NavButton, ErrorSummary, ErrorSummaryItem, Loader } from '@navikt/ds-react';

import { Endringstrekant } from '../../../../components/Endringstrekant';
import { ErrorMessage } from '../../../../components/ErrorMessage';
import { Flex, FlexColumn } from '../../../../components/Flex';
import { OverstyringTimeoutModal } from '../../../../components/OverstyringTimeoutModal';
import { postAbonnerPåAktør, postOverstyrtInntekt } from '../../../../io/http';
import type { OverstyrtInntektDTO } from '../../../../io/types';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '../../../../state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '../../../../state/opptegnelser';
import { usePerson } from '../../../../state/person';
import { useAktivPeriode } from '../../../../state/tidslinje';
import { useAddToast, useRemoveToast } from '../../../../state/toasts';
import { somPenger, toKronerOgØre } from '../../../../utils/locale';

import { Begrunnelser } from './Begrunnelser';
import { ForklaringTextarea } from './ForklaringTextarea';
import { MånedsbeløpInput } from './MånedsbeløpInput';

const Container = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 0.5rem;
    }

    > div:nth-of-type(2) {
        margin-bottom: 2rem;
    }
`;

const Tabell = styled.div`
    display: grid;
    grid-template-columns: 200px auto;
    grid-column-gap: 1rem;
    grid-row-gap: 0.25rem;

    p {
        line-height: 36px;
        vertical-align: center;
    }
`;

const Bold = styled(BodyShort)`
    font-weight: 600;
`;

const OpprinneligMånedsbeløp = styled(BodyShort)<{ harEndringer: boolean }>`
    visibility: hidden;
    margin-left: 1rem;
    text-decoration: line-through;
    ${(props) =>
        props.harEndringer &&
        css`
            visibility: visible;
        `}
`;

const OmregnetTilÅrsinntekt = styled.div<{ harEndringer: boolean }>`
    ${(props) =>
        props.harEndringer &&
        css`
            > p {
                font-style: italic;
            }
        `}
`;

const OmregnetTilÅrsinntektContainer = styled.div<{ harEndringer: boolean }>`
    position: relative;
    display: flex;
    align-items: center;

    ${(props) =>
        props.harEndringer &&
        css`
            > p {
                padding-left: 1rem;
                font-style: italic;
            }
        `}
`;

const Warning = styled(BodyShort)`
    font-style: italic;
`;

const Buttons = styled.span`
    display: flex;
    margin-top: 2rem;

    > button:not(:last-of-type) {
        margin-right: 0.5rem;
    }
`;

const Button = styled(NavButton)`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 5px 23px;

    &:hover,
    &:disabled,
    &.navds-button:disabled {
        border-width: 2px;
        border-color: var(--navds-color-disabled);
        padding: 5px 23px;
    }

    > svg.spinner {
        margin-left: 0.5rem;
    }
`;

const FeiloppsummeringContainer = styled.div`
    margin: 1.5rem 0 0.5rem;
`;

const useGetOverstyrtInntekt = () => {
    const { aktørId, fødselsnummer } = usePerson() as Person;
    const { id, organisasjonsnummer, skjæringstidspunkt } = useAktivPeriode();

    return (begrunnelse: string, forklaring: string, månedligInntekt: number) => ({
        aktørId: aktørId,
        fødselsnummer: fødselsnummer,
        organisasjonsnummer: organisasjonsnummer,
        begrunnelse: begrunnelse,
        forklaring: forklaring,
        månedligInntekt: månedligInntekt,
        skjæringstidspunkt: skjæringstidspunkt as string,
    });
};

const usePostOverstyrtInntekt = (onFerdigKalkulert: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const opptegnelser = useOpptegnelser();
    const { aktørId } = usePerson() as Person;
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
                    postAbonnerPåAktør(aktørId).then(() => setPollingRate(1000));
                })
                .catch((error) => {
                    switch (error.statusCode) {
                        default: {
                            console.log(error);
                            setError('Kunne ikke overstyre inntekt. Prøv igjen senere. ');
                        }
                    }
                    setIsLoading(false);
                });
        },
    };
};

interface EditableInntektProps {
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt;
    close: () => void;
    onEndre: (erEndret: boolean) => void;
}

export const EditableInntekt = ({ omregnetÅrsinntekt, close, onEndre }: EditableInntektProps) => {
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const getOverstyrtInntekt = useGetOverstyrtInntekt();

    const cancelEditing = () => {
        onEndre(false);
        close();
    };

    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntekt(cancelEditing);

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;
    const values = form.getValues();
    const harEndringer = Number.parseInt(values.manedsbelop) !== omregnetÅrsinntekt.månedsbeløp;

    useEffect(() => {
        if (!isNaN(values.manedsbelop)) {
            onEndre(Number.parseInt(values.manedsbelop) !== omregnetÅrsinntekt.månedsbeløp);
        }
    }, [values, omregnetÅrsinntekt]);

    useEffect(() => {
        harFeil && feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    const confirmChanges = () => {
        const { begrunnelse, forklaring, manedsbelop } = form.getValues();
        const overstyrtInntekt = getOverstyrtInntekt(begrunnelse, forklaring, Number.parseInt(manedsbelop));
        postOverstyring(overstyrtInntekt);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <Container>
                    <Tabell>
                        <BodyShort>Månedsbeløp</BodyShort>
                        <Flex>
                            <FlexColumn>
                                <MånedsbeløpInput initialMånedsbeløp={omregnetÅrsinntekt.månedsbeløp} />
                            </FlexColumn>
                            <OpprinneligMånedsbeløp as="p" harEndringer={harEndringer}>
                                {toKronerOgØre(omregnetÅrsinntekt.månedsbeløp)}
                            </OpprinneligMånedsbeløp>
                        </Flex>
                    </Tabell>
                    <Warning as="p">Endringen vil gjelde fra skjæringstidspunktet</Warning>
                    <Tabell>
                        <OmregnetTilÅrsinntekt harEndringer={harEndringer}>
                            <BodyShort>
                                {omregnetÅrsinntekt?.kilde === 'Infotrygd'
                                    ? 'Sykepengegrunnlag før 6G'
                                    : 'Omregnet til årsinntekt'}
                            </BodyShort>
                        </OmregnetTilÅrsinntekt>
                        <OmregnetTilÅrsinntektContainer harEndringer={harEndringer}>
                            {harEndringer && <Endringstrekant />}
                            <Bold as="p">{somPenger(omregnetÅrsinntekt.beløp)}</Bold>
                        </OmregnetTilÅrsinntektContainer>
                    </Tabell>
                    <Begrunnelser />
                    <ForklaringTextarea />
                    {!form.formState.isValid && form.formState.isSubmitted && (
                        <FeiloppsummeringContainer>
                            <ErrorSummary ref={feiloppsummeringRef} heading="Skjemaet inneholder følgende feil:">
                                {Object.entries(form.formState.errors).map(([id, error]) => (
                                    <ErrorSummaryItem key={id}>{error.message}</ErrorSummaryItem>
                                ))}
                            </ErrorSummary>
                        </FeiloppsummeringContainer>
                    )}
                    <Buttons>
                        <Button as="button" disabled={isLoading} variant="secondary">
                            Ferdig
                            {isLoading && <Loader size="xsmall" />}
                        </Button>
                        <Button as="button" variant="tertiary" onClick={cancelEditing}>
                            Avbryt
                        </Button>
                    </Buttons>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {timedOut && <OverstyringTimeoutModal onRequestClose={() => setTimedOut(false)} />}
                </Container>
            </form>
        </FormProvider>
    );
};
