import { BegrunnelseForOverstyring } from './overstyring.types';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useContext, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Error } from '@navikt/ds-icons';
import { BodyShort, ErrorSummary, Loader, Button as NavButton } from '@navikt/ds-react';

import { EditButton } from '@components/EditButton';
import { ErrorMessage } from '@components/ErrorMessage';
import { Flex, FlexColumn } from '@components/Flex';
import { ForklaringTextarea } from '@components/ForklaringTextarea';
import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import { Maybe } from '@io/graphql';

import { VenterPåEndringContext } from '../../VenterPåEndringContext';
import { Begrunnelser } from '../inntekt/Begrunnelser';
import { AngreOverstyrArbeidsforholdUtenSykdom } from './AngreOverstyrArbeidsforholdUtenSykdom';
import { useGetOverstyrtArbeidsforhold, usePostOverstyrtArbeidsforhold } from './overstyrArbeidsforholdHooks';

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
    margin-top: 1rem;
    min-width: 495px;

    ${(props) =>
        props.editing &&
        css`
            margin-left: -15px;
            border-left: 3px solid var(--a-surface-action);
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
    color: var(--a-text-default);
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
        border-color: var(--a-border-default);
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
    skjæringstidspunkt: string;
    arbeidsforholdErDeaktivert?: Maybe<boolean>;
}

export const OverstyrArbeidsforholdUtenSykdom = ({
    organisasjonsnummerAktivPeriode,
    skjæringstidspunkt,
    arbeidsforholdErDeaktivert,
}: OverstyrArbeidsforholdUtenSykdomProps) => {
    const [editingArbeidsforhold, setEditingArbeidsforhold] = useState(false);

    const tittel = arbeidsforholdErDeaktivert
        ? 'Bruk arbeidsforholdet i beregningen likevel'
        : 'Ikke bruk arbeidsforholdet i beregningen';

    const { venterPåEndringState, oppdaterVenterPåEndringState } = useContext(VenterPåEndringContext);

    const skalViseAngreknapp = venterPåEndringState.visAngreknapp && arbeidsforholdErDeaktivert;
    const skalViseOverstyr = venterPåEndringState.visOverstyrKnapp && !arbeidsforholdErDeaktivert;

    return (
        <FormContainer editing={editingArbeidsforhold}>
            <Header>
                {editingArbeidsforhold && (
                    <Flex alignItems="center">
                        <Tittel as="h1">{tittel}</Tittel>
                    </Flex>
                )}
                {skalViseAngreknapp && (
                    <AngreOverstyrArbeidsforholdUtenSykdom
                        organisasjonsnummerAktivPeriode={organisasjonsnummerAktivPeriode}
                        skjæringstidspunkt={skjæringstidspunkt}
                        onClick={() => oppdaterVenterPåEndringState({ visAngreknapp: false, visOverstyrKnapp: true })}
                    />
                )}
                {skalViseOverstyr && (
                    <EditButton
                        isOpen={editingArbeidsforhold}
                        openText="Avbryt"
                        closedText="Ikke bruk arbeidsforholdet i beregningen"
                        onOpen={() => setEditingArbeidsforhold(true)}
                        onClose={() => setEditingArbeidsforhold(false)}
                        openIcon={<></>}
                        closedIcon={<Error />}
                    />
                )}
            </Header>
            {editingArbeidsforhold && (
                <OverstyrArbeidsforholdSkjema
                    onClose={() => setEditingArbeidsforhold(false)}
                    organisasjonsnummerAktivPeriode={organisasjonsnummerAktivPeriode}
                    skjæringstidspunkt={skjæringstidspunkt}
                    onSubmit={() => oppdaterVenterPåEndringState({ visAngreknapp: true, visOverstyrKnapp: false })}
                />
            )}
        </FormContainer>
    );
};

interface OverstyrArbeidsforholdSkjemaProps {
    onClose: () => void;
    organisasjonsnummerAktivPeriode: string;
    skjæringstidspunkt: string;
    onSubmit: () => void;
}

const begrunnelser: BegrunnelseForOverstyring[] = [
    {
        id: '0',
        forklaring: 'Avbrudd mer enn 14 dager (generell)',
        subsumsjon: { paragraf: '8-15' },
    },
    {
        id: '1',
        forklaring: 'Avbrudd mer enn 14 dager (tilkallingsvikar/sporadiske vakter)',
        subsumsjon: { paragraf: '8-15' },
    },
    {
        id: '2',
        forklaring: 'Arbeidsforhold opphørt',
        subsumsjon: { paragraf: '8-15' },
    },
    {
        id: '3',
        forklaring: 'Annet',
        subsumsjon: { paragraf: '8-15' },
    },
];

const OverstyrArbeidsforholdSkjema = ({
    onClose,
    organisasjonsnummerAktivPeriode,
    skjæringstidspunkt,
    onSubmit,
}: OverstyrArbeidsforholdSkjemaProps) => {
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const getOverstyrtArbeidsforhold = useGetOverstyrtArbeidsforhold();

    const { isLoading, error, timedOut, setTimedOut, postOverstyring } = usePostOverstyrtArbeidsforhold(onClose);

    const confirmChanges = () => {
        const { begrunnelseId, forklaring } = form.getValues();
        const begrunnelse = begrunnelser.find((begrunnelse) => begrunnelse.id === begrunnelseId)!!;
        const overstyrtArbeidsforhold = getOverstyrtArbeidsforhold(
            organisasjonsnummerAktivPeriode,
            skjæringstidspunkt,
            true,
            forklaring,
            begrunnelse,
        );
        onSubmit();
        postOverstyring(overstyrtArbeidsforhold);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <Container>
                    <Begrunnelser begrunnelser={begrunnelser} />
                    <ForklaringTextarea
                        description={`Begrunn hvorfor inntekt ikke skal brukes i beregningen. \nBlir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.`}
                    />
                    {!form.formState.isValid && form.formState.isSubmitted && (
                        <FeiloppsummeringContainer>
                            <ErrorSummary ref={feiloppsummeringRef} heading="Skjemaet inneholder følgende feil:">
                                {Object.entries(form.formState.errors).map(([id, error]) => (
                                    <ErrorSummary.Item key={id}>
                                        <>{error ? error.message : undefined}</>
                                    </ErrorSummary.Item>
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
