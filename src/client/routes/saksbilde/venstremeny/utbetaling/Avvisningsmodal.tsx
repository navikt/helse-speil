import styled from '@emotion/styled';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, Loader, Heading } from '@navikt/ds-react';

import { Modal } from '../../../../components/Modal';

import { Begrunnelsesskjema } from './Begrunnelsesskjema';
import type { Avvisningsskjema } from './Utbetalingsdialog';
import { Begrunnelse, Årsak } from './Utbetalingsdialog';

const OkKnapp = styled(Button)`
    margin-top: 2rem;
    width: max-content;
    margin-right: 1rem;
`;

const AvbrytKnapp = styled(Button)`
    margin-top: 2rem;
    width: max-content;
`;

const StyledModal = styled(Modal)`
    padding: 2.25rem 4.25rem;
`;

interface AvvisningsModalProps {
    aktivPeriode: Tidslinjeperiode;
    isSending: boolean;
    onApprove: (skjema: Avvisningsskjema) => void;
    onClose: () => void;
}

export const Avvisningsmodal = ({ aktivPeriode, isSending, onApprove, onClose }: AvvisningsModalProps) => {
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
        <StyledModal
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
                    <Begrunnelsesskjema aktivPeriode={aktivPeriode} />
                    <div>
                        <OkKnapp as="button" disabled={isSending}>
                            Avslutt saken
                            {isSending && <Loader size="xsmall" />}
                        </OkKnapp>
                        <AvbrytKnapp as="button" variant="secondary" onClick={onClose}>
                            Avbryt
                        </AvbrytKnapp>
                    </div>
                </form>
            </FormProvider>
        </StyledModal>
    );
};
