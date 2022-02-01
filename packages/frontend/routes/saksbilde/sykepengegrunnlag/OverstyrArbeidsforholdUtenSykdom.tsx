import React, { useEffect, useRef, useState } from 'react';
import { EditButton } from '../../../components/EditButton';
import { Error } from '@navikt/ds-icons';
import { FormProvider, useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { BodyShort, ErrorSummary, ErrorSummaryItem, Loader } from '@navikt/ds-react';
import { Flex, FlexColumn } from '../../../components/Flex';
import { css } from '@emotion/react';
import { Begrunnelser } from '../../../components/Begrunnelser';
import { ForklaringTextarea } from '../../../components/ForklaringTextArea';
import { Button as NavButton } from '@navikt/ds-react';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { OverstyringTimeoutModal } from '../../../components/OverstyringTimeoutModal';
import { OverstyrtArbeidsforholdDTO } from '../../../io/types';
import { postAbonnerPåAktør, postOverstyrtArbeidsforhold } from '../../../io/http';
import { useAddToast, useRemoveToast } from '../../../state/toasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '../../../state/opptegnelser';
import { usePerson } from '../../../state/person';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '../../../state/kalkuleringstoasts';

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

const FormContainer = styled(FlexColumn)<{ editing: boolean }>`
    box-sizing: border-box;
    margin-bottom: 2rem;
    min-width: 495px;

    ${(props) =>
        props.editing &&
        css`
            background-color: var(--speil-background-secondary);
            border-left: 4px solid var(--navds-color-action-default);
            padding: 0.5rem 1rem;
        `};
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    justify-content: flex-start;
    width: 100%;

    > div > * {
        margin-right: 1rem;
    }
`;

const Tittel = styled(BodyShort)`
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    color: var(--navds-color-text-primary);
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
interface OverstyrArbeidsforholdUtenSykdomProps {
    organisasjonsnummerAktivPeriode: string;
    organisasjonsnummerPeriodeTilGodkjenning: string;
    skjæringstidspunkt: string;
}
export const OverstyrArbeidsforholdUtenSykdom = ({
    organisasjonsnummerAktivPeriode,
    organisasjonsnummerPeriodeTilGodkjenning,
    skjæringstidspunkt,
}: OverstyrArbeidsforholdUtenSykdomProps) => {
    const [editing, setEditing] = useState(false);

    return (
        <FormContainer editing={editing}>
            <Header>
                {editing && (
                    <Flex alignItems="center">
                        <Tittel as="h1">Ikke bruk inntekten i beregning</Tittel>
                    </Flex>
                )}

                <EditButton
                    isOpen={editing}
                    openText="Avbryt"
                    closedText="Ikke bruk inntekten i beregning"
                    onOpen={() => setEditing(true)}
                    onClose={() => setEditing(false)}
                    openIcon={<></>}
                    closedIcon={<Error />}
                />
            </Header>
            {editing && (
                <OverstyrArbeidsforholdSkjema
                    onClose={() => setEditing(false)}
                    organisasjonsnummerAktivPeriode={organisasjonsnummerAktivPeriode}
                    organisasjonsnummerPeriodeTilGodkjenning={organisasjonsnummerPeriodeTilGodkjenning}
                    skjæringstidspunkt={skjæringstidspunkt}
                />
            )}
        </FormContainer>
    );
};

const useGetOverstyrtArbeidsforhold = () => {
    const { aktørId, fødselsnummer } = usePerson() as Person;

    return (
        begrunnelse: string,
        forklaring: string,
        organisasjonsnummerPeriodeTilGodkjenning: string,
        organisasjonsnummerGhost: string,
        skjæringstidspunkt: string,
        arbeidsforholdErAktivt: boolean
    ) => ({
        fødselsnummer: fødselsnummer,
        organisasjonsnummer: organisasjonsnummerPeriodeTilGodkjenning,
        aktørId: aktørId,
        skjæringstidspunkt: skjæringstidspunkt,
        overstyrteArbeidsforhold: [
            {
                orgnummer: organisasjonsnummerGhost,
                erAktivt: arbeidsforholdErAktivt,
                begrunnelse: begrunnelse,
                forklaring: forklaring,
            },
        ],
    });
};

const usePostOverstyrtArbeidsforhold = (onFerdigKalkulert: () => void) => {
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
        postOverstyring: (overstyrtArbeidsforhold: OverstyrtArbeidsforholdDTO) => {
            setIsLoading(true);
            postOverstyrtArbeidsforhold(overstyrtArbeidsforhold)
                .then(() => {
                    setCalculating(true);
                    addToast(kalkulererToast({}));
                    postAbonnerPåAktør(aktørId).then(() => setPollingRate(1000));
                })
                .catch((error) => {
                    switch (error.statusCode) {
                        default: {
                            setError('Kunne ikke overstyre arbeidsforhold. Prøv igjen senere. ');
                        }
                    }
                    setIsLoading(false);
                });
        },
    };
};

interface OverstyrArbeidsforholdSkjemaProps {
    onClose: () => void;
    organisasjonsnummerAktivPeriode: string;
    organisasjonsnummerPeriodeTilGodkjenning: string;
    skjæringstidspunkt: string;
}

const OverstyrArbeidsforholdSkjema = ({
    onClose,
    organisasjonsnummerAktivPeriode,
    organisasjonsnummerPeriodeTilGodkjenning,
    skjæringstidspunkt,
}: OverstyrArbeidsforholdSkjemaProps) => {
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const getOverstyrtArbeidsforhold = useGetOverstyrtArbeidsforhold();

    const { isLoading, error, timedOut, setTimedOut, postOverstyring } = usePostOverstyrtArbeidsforhold(onClose);

    const begrunnelser = [
        'Arbeidsforholdet er ikke aktivt på skjæringstidspunktet',
        'Alternativ 2',
        'Alternativ 3',
        'Alternativ 4',
    ];

    const confirmChanges = () => {
        const { begrunnelse, forklaring } = form.getValues();
        const overstyrtArbeidsforhold = getOverstyrtArbeidsforhold(
            begrunnelse,
            forklaring,
            organisasjonsnummerPeriodeTilGodkjenning,
            organisasjonsnummerAktivPeriode,
            skjæringstidspunkt,
            false
        );
        postOverstyring(overstyrtArbeidsforhold);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <Container>
                    <Begrunnelser begrunnelser={begrunnelser} />
                    <ForklaringTextarea
                        description={`Begrunn hvorfor inntekt ikke skal brukes i beregningen. \nKommer ikke i vedtaksbrevet, men vil bli forevist bruker ved \nspørsmål om innsyn.`}
                    />
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
                        <Button as="button" variant="tertiary" onClick={onClose}>
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

const FeiloppsummeringContainer = styled.div`
    margin: 1.5rem 0 0.5rem;
`;
