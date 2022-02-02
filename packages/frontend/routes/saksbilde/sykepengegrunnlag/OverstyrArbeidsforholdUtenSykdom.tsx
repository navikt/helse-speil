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

const UndoIcon = () => (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.2187 8.60333C14.8513 6.408 13.6513 4.48667 11.84 3.194C10.04 1.90867 7.81 1.454 5.562 1.91133C3.98733 2.23267 2.514 3 1.33333 4.08533V1.16667C1.33333 0.798667 1.03467 0.5 0.666667 0.5C0.298 0.5 0 0.798667 0 1.16667V5.83333C0 6.202 0.298 6.5 0.666667 6.5H5.33333C5.70133 6.5 6 6.202 6 5.83333C6 5.46533 5.70133 5.16667 5.33333 5.16667H2.12533C3.14667 4.19067 4.44133 3.50067 5.82733 3.218C7.70933 2.83533 9.56933 3.21133 11.0647 4.27933C12.5867 5.36533 13.5947 6.97933 13.9033 8.82267C14.2113 10.6673 13.7827 12.5207 12.6967 14.0427C12.3687 14.5013 11.988 14.9193 11.564 15.2847C11.2853 15.5247 11.254 15.946 11.4947 16.2247C11.6267 16.3773 11.8133 16.4567 12 16.4567C12.154 16.4567 12.3093 16.4033 12.4347 16.2947C12.9393 15.8607 13.3927 15.3633 13.782 14.8173C15.0753 13.006 15.5853 10.7987 15.2187 8.60333Z"
            fill="#0067C5"
        />
    </svg>
);

interface OverstyrArbeidsforholdUtenSykdomProps {
    organisasjonsnummerAktivPeriode: string;
    organisasjonsnummerPeriodeTilGodkjenning: string;
    skjæringstidspunkt: string;
    arbeidsforholdErDeaktivert: boolean;
}
export const OverstyrArbeidsforholdUtenSykdom = ({
    organisasjonsnummerAktivPeriode,
    organisasjonsnummerPeriodeTilGodkjenning,
    skjæringstidspunkt,
    arbeidsforholdErDeaktivert,
}: OverstyrArbeidsforholdUtenSykdomProps) => {
    const [editing, setEditing] = useState(false);

    const tittel = arbeidsforholdErDeaktivert
        ? 'Bruk inntekten i beregningen likevel'
        : 'Ikke bruk inntekten i beregning';

    return (
        <FormContainer editing={editing}>
            <Header>
                {editing && (
                    <Flex alignItems="center">
                        <Tittel as="h1">{tittel}</Tittel>
                    </Flex>
                )}

                <EditButton
                    isOpen={editing}
                    openText="Avbryt"
                    closedText={tittel}
                    onOpen={() => setEditing(true)}
                    onClose={() => setEditing(false)}
                    openIcon={<></>}
                    closedIcon={arbeidsforholdErDeaktivert ? <UndoIcon /> : <Error />}
                />
            </Header>
            {editing && (
                <OverstyrArbeidsforholdSkjema
                    onClose={() => setEditing(false)}
                    organisasjonsnummerAktivPeriode={organisasjonsnummerAktivPeriode}
                    organisasjonsnummerPeriodeTilGodkjenning={organisasjonsnummerPeriodeTilGodkjenning}
                    skjæringstidspunkt={skjæringstidspunkt}
                    arbeidsforholdErDeaktivert={arbeidsforholdErDeaktivert}
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
        arbeidsforholdSkalAktiveres: boolean
    ) => ({
        fødselsnummer: fødselsnummer,
        organisasjonsnummer: organisasjonsnummerPeriodeTilGodkjenning,
        aktørId: aktørId,
        skjæringstidspunkt: skjæringstidspunkt,
        overstyrteArbeidsforhold: [
            {
                orgnummer: organisasjonsnummerGhost,
                erAktivt: arbeidsforholdSkalAktiveres,
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
    arbeidsforholdErDeaktivert: boolean;
}

const OverstyrArbeidsforholdSkjema = ({
    onClose,
    organisasjonsnummerAktivPeriode,
    organisasjonsnummerPeriodeTilGodkjenning,
    skjæringstidspunkt,
    arbeidsforholdErDeaktivert,
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
            arbeidsforholdErDeaktivert
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
