import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { BodyShort, Button, Loader, Textarea as NavTextarea } from '@navikt/ds-react';

import { Modal } from '../../../../../components/Modal';
import { postNotat } from '../../../../../io/http';
import { useNotaterForVedtaksperiode, useRefreshNotater } from '../../../../../state/notater';
import { getFormatertNavn, usePersondataSkalAnonymiseres } from '../../../../../state/person';
import { useOperationErrorHandler } from '../../../../../state/varsler';
import { ignorePromise } from '../../../../../utils/promise';

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

    textarea {
        min-height: 120px;
        height: max-content;
        margin: 0;
    }
`;

interface NyttNotatModalProps {
    onClose: (event?: React.SyntheticEvent) => void;
    personinfo: Personinfo;
    vedtaksperiodeId: string;
    onPostNotat?: () => void;
}

export const NyttNotatModal = ({ onClose, personinfo, vedtaksperiodeId, onPostNotat }: NyttNotatModalProps) => {
    const notaterForOppgave = useNotaterForVedtaksperiode(vedtaksperiodeId);
    const refreshNotater = useRefreshNotater();
    const errorHandler = useOperationErrorHandler('Nytt Notat');
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
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
                    onClose();
                }),
            errorHandler
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
                <BodyShort size="small">{`Søker: ${søkernavn}`}</BodyShort>
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
                                hideLabel
                                error={error?.message}
                                placeholder="Skriv hvorfor saken er lagt på vent, så det er lettere å starte igjen senere.&#10;Eks: Kontaktet arbeidsgiver, fikk ikke svar.&#10;Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn."
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value ?? ''}
                                name={name}
                                ref={ref}
                                maxLength={100}
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
