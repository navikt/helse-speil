import { ReactElement } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { BodyShort, Button, Heading, Modal } from '@navikt/ds-react';

import { Arsak } from '@external/sanity';
import { useActivePeriodHasLatestSkjæringstidspunkt } from '@hooks/revurdering';
import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import type { ApiVedtaksperiodeAnnullerRequest } from '@io/rest/generated/spesialist.schemas';
import { usePostVedtaksperiodeAnnuller } from '@io/rest/generated/vedtaksperiode/vedtaksperiode';
import { InntektsforholdReferanse } from '@state/inntektsforhold/inntektsforhold';
import { useAddToast } from '@state/toasts';

import { Annulleringsbegrunnelse } from './Annulleringsbegrunnelse';
import { Annulleringsinformasjon } from './Annulleringsinformasjon';

import styles from './Annulleringsmodal.module.scss';

type AnnulleringsModalProps = {
    closeModal: () => void;
    showModal: boolean;
    inntektsforholdReferanse: InntektsforholdReferanse;
    vedtaksperiodeId: string;
    arbeidsgiverFagsystemId: string;
    personFagsystemId: string;
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
};

export const AnnulleringsModal = ({
    closeModal,
    showModal,
    inntektsforholdReferanse,
    vedtaksperiodeId,
    arbeidsgiverFagsystemId,
    personFagsystemId,
    person,
    periode,
}: AnnulleringsModalProps): ReactElement => {
    const { mutate: annullerMutation, error, isPending: loading } = usePostVedtaksperiodeAnnuller();
    const erINyesteSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt(person);
    const addToast = useAddToast();

    const form = useForm({ mode: 'onBlur', defaultValues: { kommentar: '', arsaker: [] as string[] } });
    const kommentar = useWatch({ name: 'kommentar', control: form.control }).trim();
    const arsaker: Arsak[] = useWatch({ name: 'arsaker', control: form.control }).map((årsak: string) =>
        JSON.parse(årsak),
    );

    const harValgtAnnet = arsaker.some((it) => it.arsak === 'Annet');

    const harMinstÉnÅrsak = () => arsaker.length > 0;
    const harFeil = () => Object.keys(form.formState.errors).length > 0;

    const annullering = (): ApiVedtaksperiodeAnnullerRequest => ({
        arbeidsgiverFagsystemId,
        personFagsystemId,
        årsaker: arsaker.map((it) => ({
            key: it._key,
            årsak: it.arsak,
        })),
        kommentar: kommentar == '' ? undefined : kommentar,
    });

    const sendAnnullering = (vedtaksperiodeId: string, data: ApiVedtaksperiodeAnnullerRequest) => {
        if (harValgtAnnet && !kommentar) {
            form.setError('kommentar', {
                type: 'manual',
                message: 'Skriv en kommentar hvis du velger årsaken "annet"',
            });
        }
        if (!harMinstÉnÅrsak()) {
            form.setError('arsaker', {
                type: 'manual',
                message: 'Velg minst én årsak',
            });
        }

        function startSubmit() {
            void annullerMutation(
                {
                    vedtaksperiodeId: vedtaksperiodeId,
                    data: data,
                },
                {
                    onSuccess: () => {
                        addToast({
                            message: 'Annulleringen er sendt',
                            timeToLiveMs: 5000,
                            key: 'annullering',
                        });
                        closeModal();
                    },
                },
            );
        }

        setTimeout(() => {
            if (!harFeil()) startSubmit();
        }, 0);
    };

    return (
        <Modal aria-label="Annulleringsmodal" closeOnBackdropClick open={showModal} onClose={closeModal} width="850px">
            <Modal.Header>
                <Heading size="medium">Annullering</Heading>
            </Modal.Header>
            <Modal.Body>
                <FormProvider {...form}>
                    <form
                        className={styles.form}
                        onSubmit={form.handleSubmit(() => sendAnnullering(vedtaksperiodeId, annullering()))}
                        id="annullerings-modal-form"
                    >
                        <Annulleringsinformasjon
                            person={person}
                            periode={periode}
                            inntektsforholdReferanse={inntektsforholdReferanse}
                        />
                        <Annulleringsbegrunnelse />
                        {!erINyesteSkjæringstidspunkt && (
                            <BodyShort className={styles.varseltekst}>
                                Utbetalinger må annulleres kronologisk, nyeste først. Du kan forsøke å annullere denne,
                                men om den ikke er den nyeste vil den ikke bli annullert.
                            </BodyShort>
                        )}
                    </form>
                </FormProvider>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" form="annullerings-modal-form" loading={loading}>
                    Annuller
                </Button>
                <Button variant="tertiary" type="button" onClick={closeModal}>
                    Avbryt
                </Button>
                {error && (
                    <BodyShort className={styles.feilmelding}>
                        Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.
                    </BodyShort>
                )}
            </Modal.Footer>
        </Modal>
    );
};
