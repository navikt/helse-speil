import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button, Loader, Textarea as NavTextarea } from '@navikt/ds-react';

import { Modal } from '@components/Modal';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { postNotat } from '@io/http';
import { useOperationErrorHandler } from '@state/varsler';
import { useNotaterForVedtaksperiode, useRefreshNotater } from '@state/notater';
import { ignorePromise } from '@utils/promise';

import { SisteNotat } from './SisteNotat';
import { getFormatertNavn } from '@utils/string';
import { Personinfo } from '@io/graphql';

const Container = styled.section`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 670px;
`;

const Buttons = styled.span`
    display: flex;
    gap: 1rem;
`;

const Tittel = styled.h1`
    font-size: 24px;
    font-weight: 600;
    color: var(--navds-color-text-primary);
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

interface NyttNotatModalProps {
    onClose: (event: React.SyntheticEvent) => void;
    personinfo: Personinfo;
    vedtaksperiodeId: string;
    onPostNotat?: () => void;
}

export const NyttNotatModal = ({ onClose, personinfo, vedtaksperiodeId, onPostNotat }: NyttNotatModalProps) => {
    const notaterForOppgave = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const refreshNotater = useRefreshNotater();
    const errorHandler = useOperationErrorHandler('Nytt Notat');
    const søkernavn = getFormatertNavn(personinfo, ['E', ',', 'F', 'M']);

    const form = useForm();

    const [isFetching, setIsFetching] = useState(false);

    const sisteNotat = [...notaterForOppgave].sort((a, b) => b.opprettet.diff(a.opprettet, 'millisecond')).shift();

    const closeModal = (event: React.SyntheticEvent) => {
        onClose(event);
    };

    const submit = () => {
        setIsFetching(true);
        ignorePromise(
            postNotat(vedtaksperiodeId, { tekst: form.getValues().tekst })
                .then(() => {
                    refreshNotater();
                    onPostNotat?.();
                })
                .finally(() => {
                    setIsFetching(false);
                    onClose({} as React.SyntheticEvent);
                }),
            errorHandler,
        );
    };

    return (
        <Modal
            title={<Tittel>{onPostNotat ? 'Legg på vent' : 'Lagt på vent - ny kommentar'}</Tittel>}
            contentLabel={onPostNotat ? 'Legg på vent' : 'Lagt på vent - ny kommentar'}
            isOpen
            onRequestClose={closeModal}
        >
            <Container>
                <AnonymizableText size="small">{`Søker: ${søkernavn}`}</AnonymizableText>
                {sisteNotat && <SisteNotat notat={sisteNotat} />}
                <form onSubmit={form.handleSubmit(submit)}>
                    <Controller
                        control={form.control}
                        name="tekst"
                        rules={{
                            required: 'Begrunnelse må fylles ut',
                            maxLength: {
                                value: 100,
                                message: 'Det er kun tillatt med 100 tegn',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { error } }) => (
                            <Textarea
                                label="Begrunnelse"
                                error={error?.message}
                                description={`Skriv hvorfor saken er lagt på vent, så det er lettere å starte igjen senere.\nEks: Kontaktet arbeidsgiver, fikk ikke svar.\nBlir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.`}
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value ?? ''}
                                name={name}
                                ref={ref}
                                maxLength={100}
                                autoFocus
                            />
                        )}
                    />
                    <Buttons>
                        <Button size="small" disabled={isFetching} type="submit">
                            {onPostNotat ? 'Legg på vent' : 'Lagre'}
                            {isFetching && <Loader size="xsmall" />}
                        </Button>
                        {onPostNotat ? (
                            <Button size="small" variant="secondary" onClick={closeModal} type="button">
                                Avbryt
                            </Button>
                        ) : (
                            <Button variant="secondary" size="small" onClick={closeModal} type="button">
                                Tilbake
                            </Button>
                        )}
                    </Buttons>
                </form>
            </Container>
        </Modal>
    );
};
