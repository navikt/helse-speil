import React, { useRef, useState } from 'react';
import { EditButton } from '../../../components/EditButton';
import { Error } from '@navikt/ds-icons';
import { FormProvider, useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { BodyShort, Button as NavButton, ErrorSummary, ErrorSummaryItem, Loader } from '@navikt/ds-react';
import { Flex, FlexColumn } from '../../../components/Flex';
import { css } from '@emotion/react';
import { Begrunnelser } from '../../../components/Begrunnelser';
import { ForklaringTextarea } from '../../../components/ForklaringTextArea';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { OverstyringTimeoutModal } from '../../../components/OverstyringTimeoutModal';
import { AngreOverstyrArbeidsforholdUtenSykdom } from './AngreOverstyrArbeidsforholdUtenSykdom';
import { useGetOverstyrtArbeidsforhold, usePostOverstyrtArbeidsforhold } from './OverstyrArbeidsforholdHooks';

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

const FormButton = styled(NavButton)`
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
    const [angreButtonIsVisible, setAngreButtonIsVisible] = useState(arbeidsforholdErDeaktivert);

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
                {angreButtonIsVisible && (
                    <AngreOverstyrArbeidsforholdUtenSykdom
                        organisasjonsnummerAktivPeriode={organisasjonsnummerAktivPeriode}
                        organisasjonsnummerPeriodeTilGodkjenning={organisasjonsnummerPeriodeTilGodkjenning}
                        skjæringstidspunkt={skjæringstidspunkt}
                        setIsVisible={setAngreButtonIsVisible}
                    />
                )}
                {!arbeidsforholdErDeaktivert && (
                    <EditButton
                        isOpen={editing}
                        openText="Avbryt"
                        closedText="Ikke bruk inntekten i beregning"
                        onOpen={() => setEditing(true)}
                        onClose={() => setEditing(false)}
                        openIcon={<></>}
                        closedIcon={<Error />}
                    />
                )}
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
        '§ 8-15 - Avbrudd mer enn 14 dager (generell)',
        '§ 8-15 - Avbrudd mer enn 14 dager (tilkallingsvikar/sporadiske vakter)',
        '§ 8-15 - Arbeidsforhold opphørt',
        'Annet',
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
                        <FormButton as="button" disabled={isLoading} variant="secondary">
                            Ferdig
                            {isLoading && <Loader size="xsmall" />}
                        </FormButton>
                        <FormButton as="button" disabled={isLoading} variant="tertiary" onClick={onClose}>
                            Avbryt
                        </FormButton>
                    </Buttons>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {timedOut && <OverstyringTimeoutModal onRequestClose={() => setTimedOut(false)} />}
                </Container>
            </form>
        </FormProvider>
    );
};
