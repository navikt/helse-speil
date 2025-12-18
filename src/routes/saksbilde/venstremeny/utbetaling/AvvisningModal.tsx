import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { Button, ErrorMessage, Heading, Modal } from '@navikt/ds-react';

import { BeregnetPeriodeFragment } from '@io/graphql';
import { usePostForkasting } from '@io/rest/generated/behandlinger/behandlinger';
import { useAddToast } from '@state/toasts';
import { generateId } from '@utils/generateId';

import { Begrunnelsesskjema } from './Begrunnelsesskjema';
import { Begrunnelse } from './begrunnelse';

import styles from './AvvisningModal.module.css';

const useAddInfotrygdtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Oppgaven er sendt til behandling i Infotrygd',
            timeToLiveMs: 5000,
            key: generateId(),
            variant: 'success',
        });
    };
};

type Avvisningsskjema = {
    årsak: string;
    begrunnelser?: string[];
    kommentar?: string;
};

type AvvisningModalProps = {
    closeModal: () => void;
    showModal: boolean;
    activePeriod: BeregnetPeriodeFragment;
};

export const AvvisningModal = ({ closeModal, showModal, activePeriod }: AvvisningModalProps): ReactElement => {
    const router = useRouter();
    const form = useForm();
    const { mutate: sendTilInfotrygdMutation, error, isPending: loading } = usePostForkasting();
    const addInfotrygdtoast = useAddInfotrygdtoast();
    const kommentar = useWatch({ name: 'kommentar', control: form.control });
    const begrunnelser = useWatch({ name: 'begrunnelser', control: form.control });
    const annenBegrunnelse = begrunnelser ? begrunnelser.includes(Begrunnelse.Annet) : false;

    const harMinstÉnBegrunnelse = () => begrunnelser?.length > 0;

    const submit = async () => {
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
            await avvisUtbetaling({
                årsak: 'Feil vurdering og/eller beregning',
                begrunnelser: Array.isArray(begrunnelser) ? begrunnelser : [begrunnelser],
                kommentar: kommentar,
            });
        }
    };

    const avvisUtbetaling = async (skjema: Avvisningsskjema) => {
        const skjemaBegrunnelser: string[] = skjema.begrunnelser?.map((begrunnelse) => begrunnelse.valueOf()) ?? [];

        sendTilInfotrygdMutation(
            {
                behandlingId: activePeriod.behandlingId,
                data: {
                    kommentar: skjema.kommentar,
                    begrunnelser: skjemaBegrunnelser,
                    årsak: skjema.årsak.valueOf(),
                },
            },
            {
                onSuccess: () => {
                    addInfotrygdtoast();
                    closeModal();
                    router.push('/');
                },
            },
        );
    };

    return (
        <Modal aria-label="Avvisning modal" portal closeOnBackdropClick open={showModal} onClose={closeModal}>
            <Modal.Header>
                <Heading level="1" size="medium">
                    Kan ikke behandles her
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(submit)} id="avvisning-modal-skjema">
                        <Begrunnelsesskjema activePeriod={activePeriod} />
                    </form>
                </FormProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" form="avvisning-modal-skjema" loading={loading}>
                    Kan ikke behandles her
                </Button>
                <Button variant="tertiary" type="button" onClick={closeModal}>
                    Avbryt
                </Button>
                {error && <ErrorMessage className={styles.feilmelding}>En feil har oppstått</ErrorMessage>}
            </Modal.Footer>
        </Modal>
    );
};
