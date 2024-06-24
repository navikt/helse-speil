import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import React, { ReactElement, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, Heading, Loader, Modal } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@components/ErrorMessage';
import { AmplitudeContext } from '@io/amplitude';
import { BeregnetPeriodeFragment, TilInfoTrygdDocument } from '@io/graphql';
import { useAddToast } from '@state/toasts';
import { apolloErrorCode } from '@utils/error';

import { Begrunnelsesskjema } from './Begrunnelsesskjema';
import { Begrunnelse } from './begrunnelse';

import styles from './AvvisningModal.module.css';

const useAddInfotrygdtoast = () => {
    const addToast = useAddToast();

    return () => {
        addToast({
            message: 'Saken er sendt til behandling i Infotrygd',
            timeToLiveMs: 5000,
            key: nanoid(),
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
    onClose: () => void;
    showModal: boolean;
    activePeriod: BeregnetPeriodeFragment;
};

export const AvvisningModal = ({ onClose, showModal, activePeriod }: AvvisningModalProps): ReactElement => {
    const router = useRouter();
    const form = useForm();
    const [sendTilInfotrygdMutation, { error, loading }] = useMutation(TilInfoTrygdDocument);
    const amplitude = useContext(AmplitudeContext);
    const addInfotrygdtoast = useAddInfotrygdtoast();
    const kommentar = form.watch('kommentar');
    const begrunnelser = form.watch(`begrunnelser`);
    const annenBegrunnelse = begrunnelser ? begrunnelser.includes(Begrunnelse.Annet) : false;

    const harMinstÉnBegrunnelse = () => begrunnelser?.length > 0 ?? false;

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
        const skjemaKommentar: string[] = skjema.kommentar ? [skjema.kommentar] : [];

        await sendTilInfotrygdMutation({
            variables: {
                oppgavereferanse: activePeriod.oppgave?.id ?? '',
                kommentar: skjema.kommentar,
                begrunnelser: skjemaBegrunnelser,
                arsak: skjema.årsak.valueOf(),
            },
            onCompleted: () => {
                amplitude.logOppgaveForkastet([skjema.årsak.valueOf(), ...skjemaBegrunnelser, ...skjemaKommentar]);
                addInfotrygdtoast();
                onClose();
                router.push('/');
            },
        });
    };

    const errorMessage: string | undefined =
        error !== undefined
            ? apolloErrorCode(error) === 409
                ? 'Saken er allerede avvist'
                : 'En feil har oppstått'
            : undefined;

    return (
        <Modal aria-label="Avvisning modal" portal closeOnBackdropClick open={showModal} onClose={onClose}>
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
                <Button variant="primary" type="submit" form="avvisning-modal-skjema" disabled={loading}>
                    Kan ikke behandles her
                    {loading && <Loader className={styles.Loader} size="xsmall" />}
                </Button>
                <Button variant="tertiary" type="button" onClick={onClose}>
                    Avbryt
                </Button>
                {errorMessage && <ErrorMessage className={styles.Feilmelding}>{errorMessage}</ErrorMessage>}
            </Modal.Footer>
        </Modal>
    );
};
