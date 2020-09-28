import React from 'react';
import styled from '@emotion/styled';
import { Modal } from '../../../../../components/Modal';
import { Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Begrunnelsesskjema } from './Begrunnelsesskjema';
import { FormProvider, useForm } from 'react-hook-form';
import { Avvisningsskjema, Begrunnelse, Årsak } from '../Utbetalingsdialog';

const OkKnapp = styled(Hovedknapp)`
    margin-top: 2rem;
    width: max-content;
    margin-right: 1rem;
`;

const AvbrytKnapp = styled(Knapp)`
    margin-top: 2rem;
    width: max-content;
`;

interface Props {
    isSending: boolean;
    onApprove: (skjema: Avvisningsskjema) => void;
    onClose: () => void;
}

export const Avvisningsmodal = ({ isSending, onApprove, onClose }: Props) => {
    const form = useForm();
    const kommentar = form.watch('kommentar');
    const annenBegrunnelse = form.watch(`begrunnelser.${Begrunnelse.Annet}`);

    const måVelgeBegrunnelse = () => [Årsak.InfotrygdFeil, Årsak.Feil].includes(form.getValues().årsak);

    const harMinstÉnBegrunnelse = () => Object.values(form.getValues().begrunnelser ?? {}).some((value) => value);

    const submit = () => {
        if (annenBegrunnelse && !kommentar) {
            form.setError('kommentar', {
                type: 'manual',
                message: 'Skriv en kommentar hvis du velger begrunnelsen annet',
            });
        } else if (måVelgeBegrunnelse() && !harMinstÉnBegrunnelse()) {
            form.setError('begrunnelser', {
                type: 'manual',
                message: 'Velg minst én begrunnelse',
            });
        } else {
            const { årsak, begrunnelser, kommentar } = form.getValues();
            onApprove({
                årsak: årsak,
                begrunnelser: Object.entries(begrunnelser ?? {})
                    .filter(([_, value]) => value)
                    .map(([key]) => key) as Begrunnelse[],
                kommentar: kommentar,
            });
        }
    };

    return (
        <Modal
            isOpen
            title={<Systemtittel>Ikke utbetal</Systemtittel>}
            contentLabel="Avvis utbetaling"
            onRequestClose={onClose}
        >
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(submit)}>
                    <Begrunnelsesskjema />
                    <div>
                        <OkKnapp spinner={isSending}>Avslutt saken</OkKnapp>
                        <AvbrytKnapp htmlType="button" onClick={onClose}>
                            Avbryt
                        </AvbrytKnapp>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};
