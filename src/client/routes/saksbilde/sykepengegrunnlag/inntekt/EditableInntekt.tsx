import styled from '@emotion/styled';
import { Inntektskildetype, OmregnetÅrsinntekt, Person, Vedtaksperiode } from 'internal-types';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Feiloppsummering } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { Button as NavButton } from '@navikt/ds-react';

import { FlexColumn } from '../../../../components/Flex';
import { postOverstyrtInntekt } from '../../../../io/http';
import { OverstyrtInntektDTO } from '../../../../io/types';
import { Tidslinjeperiode } from '../../../../modell/UtbetalingshistorikkElement';
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
import { somPenger } from '../../../../utils/locale';

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
    align-items: center;
`;

const Warning = styled(Normaltekst)`
    font-style: italic;
`;

const Error = styled(Normaltekst)`
    color: var(--navds-color-text-error);
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
    margin: 2rem 0;
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

const usePostOverstyrtInntekt = () => {
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
            setCalculating(false);
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
        postOverstyring: (overstyrtInntekt: OverstyrtInntektDTO) => {
            setIsLoading(true);
            postOverstyrtInntekt(overstyrtInntekt)
                .then(() => {
                    setCalculating(true);
                    setPollingRate(1000);
                    addToast(kalkulererToast({}));
                    close();
                })
                .catch((error) => {
                    switch (error.statusCode) {
                        default:
                            setError('Kunne ikke overstyre inntekt. Prøv igjen senere.');
                    }
                })
                .finally(() => setIsLoading(false));
        },
    };
};

interface EditableInntektProps {
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
    close: () => void;
}

export const EditableInntekt = ({ omregnetÅrsinntekt, close }: EditableInntektProps) => {
    const form = useForm({ shouldFocusError: false });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const getOverstyrtInntekt = useGetOverstyrtInntekt();
    const { isLoading, error, postOverstyring } = usePostOverstyrtInntekt();

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;

    useEffect(() => {
        harFeil && feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    const confirmChanges = () => {
        const { begrunnelse, forklaring, månedsbeløp } = form.getValues();
        const overstyrtInntekt = getOverstyrtInntekt(begrunnelse, forklaring, Number.parseInt(månedsbeløp));
        postOverstyring(overstyrtInntekt);
    };

    const cancelEditing = () => {
        close();
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <Container>
                    <Tabell>
                        <Normaltekst>Månedsbeløp</Normaltekst>
                        <FlexColumn>
                            <MånedsbeløpInput initialMånedsbeløp={omregnetÅrsinntekt?.månedsbeløp} />
                        </FlexColumn>
                    </Tabell>
                    <Warning>Endringen vil gjelde fra skjæringstidspunktet</Warning>
                    <Tabell>
                        <Normaltekst>
                            {omregnetÅrsinntekt?.kilde === Inntektskildetype.Infotrygd
                                ? 'Sykepengegrunnlag før 6G'
                                : 'Omregnet til årsinntekt'}
                        </Normaltekst>
                        <Element>{somPenger(omregnetÅrsinntekt?.beløp)}</Element>
                    </Tabell>
                    <Begrunnelser />
                    <ForklaringTextarea />
                    {!form.formState.isValid && form.formState.isSubmitted && (
                        <FeiloppsummeringContainer>
                            <Feiloppsummering
                                innerRef={feiloppsummeringRef}
                                tittel="Skjemaet inneholder følgende feil:"
                                feil={Object.entries(form.errors).map(([id, error]) => ({
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
                    {error && <Error>{error}</Error>}
                </Container>
            </form>
        </FormProvider>
    );
};
