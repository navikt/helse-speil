import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button, Loader, Textarea as NavTextarea } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { Modal } from '@components/Modal';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Personinfo } from '@io/graphql';
import { postNotat } from '@io/http';
import { useNotaterForVedtaksperiode, useRefreshNotater } from '@state/notater';
import { useRefetchPerson } from '@state/person';
import { getFormatertNavn } from '@utils/string';

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

interface NyttNotatModalProps {
    onClose: (event: React.SyntheticEvent) => void;
    personinfo: Personinfo;
    vedtaksperiodeId: string;
    onSubmitOverride?: (notattekst: string) => Promise<any>;
    errorOverride?: string | undefined;
    notattype: NotatType;
    ekstraInnhold?: ReactNode;
    submitButtonText?: string;
}

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

export const NyttNotatModal = ({
    onClose,
    personinfo,
    vedtaksperiodeId,
    onSubmitOverride,
    errorOverride,
    notattype,
    ekstraInnhold,
    submitButtonText,
}: NyttNotatModalProps) => {
    const notaterForOppgave = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const refreshNotater = useRefreshNotater();
    const refetchPerson = useRefetchPerson();
    const søkernavn = personinfo ? getFormatertNavn(personinfo, ['E', ',', 'F', 'M']) : undefined;

    const form = useForm();

    const [isFetching, setIsFetching] = useState(false);
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
        setIsFetching(true);
        setError(undefined);
        if (onSubmitOverride) {
            onSubmitOverride(form.getValues().tekst).finally(() => setIsFetching(false));
        } else {
            postNotat(vedtaksperiodeId, { tekst: form.getValues().tekst, type: notattype })
                .then(() => {
                    refreshNotater(); // Refresher for oversikten, for REST
                    void refetchPerson(); // Refresher for saksbildet, for GraphQL
                    onClose({} as React.SyntheticEvent);
                })
                .catch(() => setError('Notatet kunne ikke lagres'))
                .finally(() => setIsFetching(false));
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
                    <Controller
                        control={form.control}
                        name="tekst"
                        rules={{
                            required: notattekst.errorTekst ?? 'Notat må fylles ut',
                            maxLength: {
                                value: tillattTekstlengde,
                                message: `Det er kun tillatt med ${tillattTekstlengde} tegn`,
                            },
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error } }) => (
                            <Textarea
                                label=""
                                error={error?.message}
                                description={notattekst.description}
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value ?? ''}
                                name={name}
                                ref={ref}
                                maxLength={tillattTekstlengde}
                                autoFocus
                            />
                        )}
                    />
                    <Buttons>
                        <Button size="small" disabled={isFetching} type="submit">
                            {submitButtonText ?? (onSubmitOverride ? notattekst.submitTekst : 'Lagre')}
                            {isFetching && <Loader size="xsmall" />}
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
