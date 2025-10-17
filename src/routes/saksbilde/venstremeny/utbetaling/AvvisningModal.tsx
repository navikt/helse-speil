import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, ErrorMessage, Heading, Modal } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { BeregnetPeriodeFragment, TilInfoTrygdDocument } from '@io/graphql';
import { useAddToast } from '@state/toasts';
import { apolloErrorCode } from '@utils/error';
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
    const [sendTilInfotrygdMutation, { error, loading }] = useMutation(TilInfoTrygdDocument);
    const addInfotrygdtoast = useAddInfotrygdtoast();
    const kommentar = form.watch('kommentar');
    const begrunnelser = form.watch(`begrunnelser`);
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

        await sendTilInfotrygdMutation({
            variables: {
                oppgavereferanse: activePeriod.oppgave?.id ?? '',
                kommentar: skjema.kommentar,
                begrunnelser: skjemaBegrunnelser,
                arsak: skjema.årsak.valueOf(),
            },
            onCompleted: () => {
                addInfotrygdtoast();
                closeModal();
                router.push('/');
            },
        });
    };

    const errorMessage: string | undefined =
        error !== undefined
            ? apolloErrorCode(error) === 409
                ? 'Oppgaven er allerede avvist'
                : 'En feil har oppstått'
            : undefined;

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
                {errorMessage && <ErrorMessage className={styles.feilmelding}>{errorMessage}</ErrorMessage>}
            </Modal.Footer>
        </Modal>
    );
};
