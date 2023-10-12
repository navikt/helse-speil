import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Control, useController, useForm } from 'react-hook-form';

import { Button, Loader, Textarea as NavTextarea } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@components/ErrorMessage';
import { Modal } from '@components/Modal';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { FetchPersonDocument, LeggTilNotatDocument, NotatType, Personnavn } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useNotaterForVedtaksperiode } from '@state/notater';
import { getFormatertNavn } from '@utils/string';

import { client } from '../../../../apolloClient';
import { SisteNotat } from './SisteNotat';

const Container = styled.section`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 670px;
`;

const Buttons = styled.span`
    display: flex;
    gap: 1rem;

    span {
        display: flex;
        column-gap: var(--a-spacing-2);
    }
`;

const Tittel = styled.h1`
    font-size: 24px;
    font-weight: 600;
    color: var(--a-text-default);
    margin-bottom: 0.5rem;
`;

const Textarea = styled(NavTextarea)`
    margin-top: 1rem;
    margin-bottom: 1rem;
    white-space: pre-line;

    textarea {
        min-height: 120px;
        height: max-content;
        margin: 0;
    }
`;

const NotatErrorMessage = styled(ErrorMessage)`
    margin-top: 1rem;
`;

interface Notattekster {
    tittel: string;
    description: string;
    submitTekst: string;
    errorTekst?: string;
}

const notattypeTekster = (notattype: NotatType): Notattekster => {
    switch (notattype) {
        case 'PaaVent':
            return {
                tittel: 'Legg på vent',
                description:
                    'Skriv hvorfor saken er lagt på vent, så det er lettere å starte igjen senere.\nEks: Kontaktet arbeidsgiver, fikk ikke svar.\nBlir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.',
                submitTekst: 'Legg på vent',
            };
        case 'Retur':
            return {
                tittel: 'Retur',
                description:
                    'Skriv hvorfor saken returneres, så det er enkelt å forstå hva som må vurderes og gjøres om.\nEksempel: Ferie for 01.07.2022 må korrigeres.\nBlir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.',
                submitTekst: 'Returner',
                errorTekst: 'Du må skrive et returnotat hvis du vil sende oppgaven i retur til saksbehandler.',
            };
        default:
            return {
                tittel: 'Notat',
                description: 'Blir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.',
                submitTekst: 'Legg til notat',
            };
    }
};

interface NyttNotatModalProps {
    onClose: (event: React.SyntheticEvent) => void;
    navn: Personnavn;
    vedtaksperiodeId: string;
    onSubmitOverride?: (notattekst: string) => Promise<unknown>;
    errorOverride?: string | undefined;
    notattype: NotatType;
    ekstraInnhold?: ReactNode;
    submitButtonText?: string;
}

export const NyttNotatModal = ({
    onClose,
    navn,
    vedtaksperiodeId,
    onSubmitOverride,
    errorOverride,
    notattype,
    ekstraInnhold,
    submitButtonText,
}: NyttNotatModalProps) => {
    const notaterForOppgave = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const { oid } = useInnloggetSaksbehandler();
    const [nyttNotat, { loading }] = useMutation(LeggTilNotatDocument);
    const søkernavn = navn ? getFormatertNavn(navn, ['E', ',', 'F', 'M']) : undefined;

    const form = useForm();

    const [error, setError] = useState<string | undefined>();

    const notattekst = notattypeTekster(notattype);

    const sisteNotat = [...notaterForOppgave]
        .filter((it) => !it.feilregistrert && it.type === notattype)
        .sort((a, b) => b.opprettet.diff(a.opprettet, 'millisecond'))
        .shift();

    const closeModal = (event: React.SyntheticEvent) => {
        setError(undefined);
        onClose(event);
    };

    const submit = () => {
        setError(undefined);
        if (onSubmitOverride) {
            onSubmitOverride(form.getValues().tekst);
        } else {
            nyttNotat({
                variables: {
                    oid: oid,
                    tekst: form.getValues().tekst,
                    type: notattype,
                    vedtaksperiodeId: vedtaksperiodeId,
                },
                update: (cache, { data }) => {
                    cache.modify({
                        id: cache.identify({ __typename: 'Notater', id: vedtaksperiodeId }),
                        fields: {
                            notater(existingNotater) {
                                return [...existingNotater, data];
                            },
                        },
                    });
                },
            })
                .then(() => {
                    client.refetchQueries({ include: [FetchPersonDocument] });
                    onClose({} as React.SyntheticEvent);
                })
                .catch((err) => {
                    setError(err.statusCode === 401 ? 'Du har blitt logget ut' : 'Notatet kunne ikke lagres');
                });
        }
    };

    const tillattTekstlengde = 1_000;
    const errorMessage = errorOverride ?? error;
    return (
        <Modal
            title={<Tittel>{notattekst.tittel}</Tittel>}
            contentLabel={notattekst.tittel}
            isOpen
            onRequestClose={closeModal}
        >
            <Container>
                {søkernavn && <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>}
                {sisteNotat && <SisteNotat notat={sisteNotat} />}
                {ekstraInnhold}
                <form onSubmit={form.handleSubmit(submit)}>
                    <ControlledTextarea
                        control={form.control}
                        notattekst={notattekst}
                        tillattTekstlengde={tillattTekstlengde}
                    />
                    <Buttons>
                        <Button size="small" disabled={loading} type="submit">
                            {submitButtonText ?? (onSubmitOverride ? notattekst.submitTekst : 'Lagre')}
                            {loading && <Loader size="xsmall" />}
                        </Button>
                        <Button size="small" variant="secondary" onClick={closeModal} type="button">
                            Avbryt
                        </Button>
                    </Buttons>
                </form>
            </Container>
            {errorMessage && <NotatErrorMessage>{errorMessage}</NotatErrorMessage>}
        </Modal>
    );
};

interface ControlledTextareaProps {
    control: Control;
    notattekst: Notattekster;
    tillattTekstlengde: number;
}

const ControlledTextarea = ({ control, notattekst, tillattTekstlengde }: ControlledTextareaProps) => {
    const { field, fieldState } = useController({
        control: control,
        name: 'tekst',
        rules: {
            required: notattekst.errorTekst ?? 'Notat må fylles ut',
            maxLength: {
                value: tillattTekstlengde,
                message: `Det er kun tillatt med ${tillattTekstlengde} tegn`,
            },
        },
    });
    return (
        <Textarea
            {...field}
            {...fieldState}
            error={fieldState.error?.message}
            label={notattekst.tittel}
            hideLabel
            description={notattekst.description}
            maxLength={tillattTekstlengde}
            autoFocus
        />
    );
};
