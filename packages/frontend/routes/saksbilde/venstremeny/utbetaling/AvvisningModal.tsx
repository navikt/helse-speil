import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Heading, Loader } from '@navikt/ds-react';

import { Modal } from '@components/Modal';
import { BeregnetPeriode } from '@io/graphql';

import { Begrunnelsesskjema } from './Begrunnelsesskjema';

import styles from './AvvisningModal.module.css';

enum Årsak {
    Feil = 'Feil vurdering og/eller beregning',
    InfotrygdRiktig = 'Allerede behandlet i infotrygd - riktig vurdering',
    InfotrygdFeil = 'Allerede behandlet i infotrygd - feil vurdering og/eller beregning',
}

export enum Begrunnelse {
    Annet = 'Annet',
}

export type Avvisningsskjema = {
    årsak: Årsak;
    begrunnelser?: string[];
    kommentar?: string;
};

interface AvvisningModalProps {
    activePeriod: BeregnetPeriode;
    isSending: boolean;
    onApprove: (skjema: Avvisningsskjema) => void;
    onClose: () => void;
}

export const AvvisningModal = ({ activePeriod, isSending, onApprove, onClose }: AvvisningModalProps) => {
    const form = useForm();
    const kommentar = form.watch('kommentar');
    const begrunnelser = form.watch(`begrunnelser`);
    const annenBegrunnelse = begrunnelser ? begrunnelser.includes(Begrunnelse.Annet) : false;

    const harMinstÉnBegrunnelse = () => begrunnelser?.length > 0 ?? false;

    const submit = () => {
        if (annenBegrunnelse && !kommentar) {
            form.setError('kommentar', {
                type: 'manual',
                message: 'Skriv en kommentar hvis du velger begrunnelsen "annet"',
            });
        } else if (!harMinstÉnBegrunnelse()) {
            form.setError('begrunnelser', {
                type: 'manual',
                message: 'Velg minst én begrunnelse',
            });
        } else {
            const { begrunnelser, kommentar } = form.getValues();
            onApprove({
                årsak: Årsak.Feil,
                begrunnelser: Array.isArray(begrunnelser) ? begrunnelser : [begrunnelser],
                kommentar: kommentar,
            });
        }
    };

    return (
        <Modal
            className={styles.AvvisningModal}
            isOpen
            title={
                <Heading as="h2" size="large">
                    Kan ikke behandles her
                </Heading>
            }
            contentLabel="Kan ikke behandles her"
            onRequestClose={onClose}
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(submit)}>
                    <Begrunnelsesskjema activePeriod={activePeriod} />
                    <div className={styles.Buttons}>
                        <Button disabled={isSending}>
                            Kan ikke behandles her
                            {isSending && <Loader size="xsmall" />}
                        </Button>
                        <Button variant="secondary" onClick={onClose}>
                            Avbryt
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};
