import React, { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, Heading, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { GammelModal } from '@components/Modal';
import { BeregnetPeriodeFragment, Maybe } from '@io/graphql';

import { Begrunnelsesskjema } from './Begrunnelsesskjema';
import { Begrunnelse } from './begrunnelse';

import styles from './AvvisningModal.module.css';

export type Avvisningsskjema = {
    årsak: string;
    begrunnelser?: string[];
    kommentar?: string;
};

interface AvvisningModalProps {
    activePeriod: BeregnetPeriodeFragment;
    isSending: boolean;
    onApprove: (skjema: Avvisningsskjema) => void;
    onClose: () => void;
    error: Maybe<string>;
}

export const AvvisningModal = ({
    activePeriod,
    isSending,
    onApprove,
    onClose,
    error,
}: AvvisningModalProps): ReactElement => {
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
                årsak: 'Feil vurdering og/eller beregning',
                begrunnelser: Array.isArray(begrunnelser) ? begrunnelser : [begrunnelser],
                kommentar: kommentar,
            });
        }
    };

    return (
        <GammelModal
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
                            {isSending && <Loader className={styles.Loader} size="xsmall" />}
                        </Button>
                        <Button variant="secondary" onClick={onClose} type="button">
                            Avbryt
                        </Button>
                    </div>
                    <ErrorMessage className={styles.Feilmelding}>{error}</ErrorMessage>
                </form>
            </FormProvider>
        </GammelModal>
    );
};
