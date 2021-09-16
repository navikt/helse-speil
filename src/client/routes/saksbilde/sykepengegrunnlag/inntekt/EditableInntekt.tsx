import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Inntektskildetype, OmregnetÅrsinntekt, Person, Vedtaksperiode } from 'internal-types';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Feiloppsummering } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { BodyShort, Button as NavButton } from '@navikt/ds-react';

import { ErrorMessage } from '../../../../components/ErrorMessage';
import { Flex, FlexColumn } from '../../../../components/Flex';
import { OverstyringTimeoutModal } from '../../../../components/OverstyringTimeoutModal';
import { Overstyringsindikator } from '../../../../components/Overstyringsindikator';
import { postOverstyrtInntekt } from '../../../../io/http';
import { OverstyrtInntektDTO } from '../../../../io/types';
import { Tidslinjeperiode } from '../../../../modell/utbetalingshistorikkelement';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '../../../../state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '../../../../state/opptegnelser';
import { usePerson } from '../../../../state/person';
import { useAktivPeriode, useVedtaksperiode } from '../../../../state/tidslinje';
import { useAddToast, useRemoveToast } from '../../../../state/toasts';
import { ISO_DATOFORMAT } from '../../../../utils/date';
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

const OpprinneligMånedsbeløp = styled(BodyShort)`
    text-decoration: line-through;
    margin-left: 1rem;
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
    const { id, organisasjonsnummer } = useAktivPeriode() as Tidslinjeperiode;
    const { vilkår } = useVedtaksperiode(id) as Vedtaksperiode;

    return (begrunnelse: string, forklaring: string, månedsbeløp: number) => ({
        aktørId: aktørId,
        fødselsnummer: fødselsnummer,
        organisasjonsnummer: organisasjonsnummer,
        begrunnelse: begrunnelse,
        forklaring: forklaring,
        månedsbeløp: månedsbeløp,
        skjæringstidspunkt: vilkår!.dagerIgjen.skjæringstidspunkt.format(ISO_DATOFORMAT),
    });
};

const usePostOverstyrtInntekt = (onFerdigKalkulert: () => void) => {
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
              }, 10000)
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
                    setPollingRate(1000);
                    addToast(kalkulererToast({}));
                })
                .catch((error) => {
                    switch (error.statusCode) {
                        default:
                            setError('Kunne ikke overstyre inntekt. Prøv igjen senere.');
                    }
                    setIsLoading(false);
                });
        },
    };
};

interface EditableInntektProps {
    omregnetÅrsinntekt: OmregnetÅrsinntekt;
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
    const harEndringer = Number.parseInt(values.månedsbeløp) !== omregnetÅrsinntekt.månedsbeløp;

    useEffect(() => {
        if (!isNaN(values.månedsbeløp)) {
            onEndre(Number.parseInt(values.månedsbeløp) !== omregnetÅrsinntekt.månedsbeløp);
        }
    }, [values, omregnetÅrsinntekt]);

    useEffect(() => {
        harFeil && feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    const confirmChanges = () => {
        const { begrunnelse, forklaring, månedsbeløp } = form.getValues();
        const overstyrtInntekt = getOverstyrtInntekt(begrunnelse, forklaring, Number.parseInt(månedsbeløp));
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
                            <OpprinneligMånedsbeløp component="p">
                                {toKronerOgØre(omregnetÅrsinntekt.månedsbeløp)}
                            </OpprinneligMånedsbeløp>
                        </Flex>
                    </Tabell>
                    <Warning component="p">Endringen vil gjelde fra skjæringstidspunktet</Warning>
                    <Tabell>
                        <OmregnetTilÅrsinntekt harEndringer={harEndringer}>
                            <BodyShort>
                                {omregnetÅrsinntekt?.kilde === Inntektskildetype.Infotrygd
                                    ? 'Sykepengegrunnlag før 6G'
                                    : 'Omregnet til årsinntekt'}
                            </BodyShort>
                        </OmregnetTilÅrsinntekt>
                        <OmregnetTilÅrsinntektContainer harEndringer={harEndringer}>
                            {harEndringer && <Overstyringsindikator />}
                            <Bold component="p">{somPenger(omregnetÅrsinntekt.beløp)}</Bold>
                        </OmregnetTilÅrsinntektContainer>
                    </Tabell>
                    <Begrunnelser />
                    <ForklaringTextarea />
                    {!form.formState.isValid && form.formState.isSubmitted && (
                        <FeiloppsummeringContainer>
                            <Feiloppsummering
                                innerRef={feiloppsummeringRef}
                                tittel="Skjemaet inneholder følgende feil:"
                                feil={Object.entries(form.formState.errors).map(([id, error]) => ({
                                    skjemaelementId: id,
                                    feilmelding: error.message,
                                }))}
                            />
                        </FeiloppsummeringContainer>
                    )}
                    <Buttons>
                        <Button disabled={isLoading} variant="primary">
                            Ferdig
                            {isLoading && <NavFrontendSpinner type="XXS" />}
                        </Button>
                        <Button variant="secondary" onClick={cancelEditing}>
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
