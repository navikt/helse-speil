import styled from '@emotion/styled';
import { Inntektskildetype, OmregnetÅrsinntekt } from 'internal-types';
import React, { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Feiloppsummering } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { Button as NavButton } from '@navikt/ds-react/esm/button';

import { FlexColumn } from '../../../../components/Flex';
import { somPenger } from '../../../../utils/locale';

import { BegrunnelseTextarea } from './BegrunnelseTextarea';
import { MånedsbeløpInput } from './MånedsbeløpInput';

const Container = styled.div`
    display: flex;
    flex-direction: column;

    > * {
        margin-bottom: 0.5rem;
    }

    > .warning {
        margin-bottom: 4rem;
    }
`;

const Tabell = styled.div`
    display: grid;
    grid-template-columns: 200px auto;
    grid-column-gap: 1rem;
    grid-row-gap: 0.25rem;
`;

const Warning = styled(Normaltekst)`
    color: var(--navds-color-text-error);
`;

const Buttons = styled.span`
    margin-top: 2rem;

    > button:not(:last-of-type) {
        margin-right: 0.5rem;
    }
`;

const Button = styled(NavButton)`
    padding: 5px 23px;
`;

const FeiloppsummeringContainer = styled.div`
    margin: 2rem 0;
`;

interface EditableInntektProps {
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
    close: () => void;
}

export const EditableInntekt = ({ omregnetÅrsinntekt, close }: EditableInntektProps) => {
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;

    useEffect(() => {
        harFeil && feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    const confirmChanges = () => {};

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
                        <Normaltekst>
                            {omregnetÅrsinntekt?.kilde === Inntektskildetype.Infotrygd
                                ? 'Sykepengegrunnlag før 6G'
                                : 'Omregnet til årsinntekt'}
                        </Normaltekst>
                        <Element>{somPenger(omregnetÅrsinntekt?.beløp)}</Element>
                    </Tabell>
                    <Warning className="warning">Varseltekst om at man endrer tilbake til skjæringstidspunkt</Warning>
                    <BegrunnelseTextarea />
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
                        <Button variant="primary">Ferdig</Button>
                        <Button variant="secondary" onClick={cancelEditing}>
                            Avbryt
                        </Button>
                    </Buttons>
                </Container>
            </form>
        </FormProvider>
    );
};
