import React, { ChangeEvent } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { BodyShort, Button, Heading, Loader, Textarea } from '@navikt/ds-react';

import { Personinfo } from '@io/graphql';
import { useCurrentPerson } from '@state/person';
import { isPerson } from '@utils/typeguards';
import { capitalizeName } from '@utils/locale';
import { Modal } from '@components/Modal';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';

import styles from './ReturModal.module.css';

export type Returskjema = {
    notat: string;
};

interface ReturModalProps {
    isSending: boolean;
    onApprove: (skjema: Returskjema) => void;
    onClose: () => void;
}

const getFormattedName = (personinfo: Personinfo): string => {
    const { fornavn, mellomnavn, etternavn } = personinfo;
    return capitalizeName(`${fornavn}${mellomnavn ? ` ${mellomnavn} ` : ''} ${etternavn}`);
};

export const ReturModal = ({ isSending, onApprove, onClose }: ReturModalProps) => {
    const form = useForm();
    const person = useCurrentPerson();
    if (!isPerson(person)) {
        throw Error('Mangler persondata.');
    }
    const notat = form.watch('notat');

    const submit = () => {
        if (!notat) {
            form.setError('notat', {
                type: 'manual',
                message: 'Du må skrive et returnotat hvis du vil sende oppgaven i retur til saksbehandler.',
            });
        } else {
            const { notat } = form.getValues();
            onApprove({
                notat: notat,
            });
        }
    };

    return (
        <Modal
            className={styles.ReturModal}
            isOpen
            title={
                <Heading as="h2" size="large">
                    Returner
                </Heading>
            }
            contentLabel="Returner"
            onRequestClose={onClose}
        >
            <BodyShort className={styles.Soker}>
                Søker: <AnonymizableText>{getFormattedName(person.personinfo)}</AnonymizableText>
            </BodyShort>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(submit)}>
                    <Controller
                        name="notat"
                        defaultValue=""
                        render={({ field: { value, onChange } }) => (
                            <Textarea
                                className={styles.Textarea}
                                name="notat"
                                value={value}
                                label=""
                                error={form.formState.errors.notat ? form.formState.errors.notat.message : null}
                                onChange={(event: ChangeEvent) => {
                                    form.clearErrors('notat');
                                    onChange(event);
                                }}
                                aria-invalid={form.formState.errors.notat?.message}
                                aria-errormessage={form.formState.errors.notat?.message}
                                description={`Skriv hvorfor saken returneres, så det er enkelt å forstå hva som må vurderes og gjøres om.\nEksempel: Ferie for 01.07.2022 må korrigeres.\nBlir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.`}
                                maxLength={500}
                                rows={4}
                            />
                        )}
                    />
                    <div className={styles.Buttons}>
                        <Button variant="secondary" disabled={isSending}>
                            Returner
                            {isSending && <Loader size="xsmall" />}
                        </Button>
                        <Button variant="tertiary" onClick={onClose}>
                            Avbryt
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};
