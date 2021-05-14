import styled from '@emotion/styled';
import {Modal} from '../../../components/Modal';
import {Flatknapp, Knapp} from 'nav-frontend-knapper';
import {Feilmelding as NavFeilmelding, Normaltekst} from 'nav-frontend-typografi';
import {Person, UtbetalingshistorikkUtbetaling} from 'internal-types';
import React, {ChangeEvent, useState} from 'react';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import {AnnulleringDTO} from '../../../io/types';
import {postAnnullering} from '../../../io/http';
import {Annulleringsvarsel} from '../sakslinje/annullering/Annulleringsvarsel';
import {findEarliest, findLatest, NORSK_DATOFORMAT} from '../../../utils/date';
import {AnnulleringÅrsak} from '../sakslinje/annullering/Annulleringsmodal';
import {Radio, RadioGruppe, Textarea} from 'nav-frontend-skjema';

const ModalContainer = styled(Modal)`
    max-width: 48rem;
    padding: 2.25rem 4.25rem;

    .skjemaelement__feilmelding {
        font-style: normal;
        padding-bottom: 1rem;
    }
`;

const Form = styled.form`
    .skjemagruppe .skjemagruppe__legend {
        padding-top: 1.5em;
        margin: 1.5rem 0;
    }

    .skjemagruppe.radiogruppe .skjemaelement {
        margin-bottom: 1.5rem;
    }

    .skjemaelement.textarea__container {
        padding-top: 1rem;
    }

    .skjemaelement__input.textarea--medMeta {
        height: 120px !important;
        margin-bottom: 0.5rem;
    }
`;

const Tittel = styled.h1`
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--navds-color-text-primary);
    margin-bottom: 1.5rem;
`;

const AnnullerKnapp = styled(Knapp)`
    margin-right: 1rem;
`;

const Feilmelding = styled(NavFeilmelding)`
    margin-top: 0.625rem;
`;

const TilAnnullering = styled.div`
    margin: 1.5rem 0 0 2rem;
`;

const Utbetalingsgruppe = styled.div`
    margin-bottom: 2rem;
`;

const StyledKnapperad = styled.div`
    margin-top: 2.5rem;
`;

const RadioButton = styled(Radio)`
    .skjemaelement__label::before {
        width: 22px;
        height: 22px;
        
    .skjemagruppe .skjemagruppe__legend {
        margin: 1.5rem 0;
    }
    .skjemaelement.textarea__container .skjemaelement__label {
        font-weight: normal;
    }
    .skjemaelement__input.textarea--medMeta {
        height: 120px !important;
    }
`;

interface Props {
    person: Person;
    utbetaling: UtbetalingshistorikkUtbetaling;
    onClose: () => void;
    onSuccess: () => void;
}

export const Annulleringsmodal = ({ person, utbetaling, onClose, onSuccess }: Props) => {
    const [isSending, setIsSending] = useState<boolean>(false);
    const [postAnnulleringFeil, setPostAnnulleringFeil] = useState<string>();

    const form = useForm({ mode: 'onBlur' });

    const kommentar = form.watch('kommentar');
    const annenÅrsak = form.watch(`årsak`) === AnnulleringÅrsak.Annet;
    const harMinstÉnÅrsak = () => form.getValues()?.årsak ?? false;

    const annullering = (årsak: AnnulleringÅrsak, kommentar: string = ''): AnnulleringDTO => ({
        aktørId: person.aktørId,
        fødselsnummer: person.fødselsnummer,
        organisasjonsnummer: utbetaling.arbeidsgiverOppdrag.orgnummer,
        fagsystemId: utbetaling.arbeidsgiverOppdrag.fagsystemId,
        årsak: årsak,
        kommentar: kommentar,
    });

    const sendAnnullering = (annullering: AnnulleringDTO) => {
        setIsSending(true);
        setPostAnnulleringFeil(undefined);
        postAnnullering(annullering)
            .then(() => {
                onSuccess();
                onClose();
            })
            .catch(() => setPostAnnulleringFeil('Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.'))
            .finally(() => setIsSending(false));
    };

    const submit = () => {
        if (annenÅrsak && !kommentar) {
            form.setError('kommentar', {
                type: 'manual',
                message: 'Skriv en kommentar hvis du velger årsaken annet',
            });
        } else if (!harMinstÉnÅrsak()) {
            form.setError('årsak', {
                type: 'manual',
                message: 'Velg minst én årsak',
            });
        } else {
            const { årsak, kommentar } = form.getValues();
            sendAnnullering(annullering(årsak, kommentar));
        }
    };

    const tidligsteFom = findEarliest(utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.map((l) => l.fom));
    const sisteTom = findLatest(utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.map((l) => l.tom));

    return (
        <FormProvider {...form}>
            <ModalContainer
                className="AnnulleringModal"
                isOpen={true}
                contentLabel="Feilmelding"
                onRequestClose={onClose}
            >
                <Form onSubmit={form.handleSubmit(submit)}>
                    <Annulleringsvarsel />
                    <Tittel>Annullering</Tittel>
                    <Utbetalingsgruppe>
                        <TilAnnullering>
                            <Normaltekst>Følgende utbetaling annulleres:</Normaltekst>
                            <Normaltekst>
                                {tidligsteFom.format(NORSK_DATOFORMAT)} - {sisteTom.format(NORSK_DATOFORMAT)}
                            </Normaltekst>
                        </TilAnnullering>
                    </Utbetalingsgruppe>
                    <RadioGruppe
                        legend="Årsak til annullering"
                        feil={form.errors.årsak ? 'Årsak må velges før saken kan avsluttes' : null}
                    >
                        <RadioButton
                            label={AnnulleringÅrsak.Automatisk}
                            name="årsak"
                            value={AnnulleringÅrsak.Automatisk}
                            // @ts-ignore
                            radioRef={form.register({ required: true })}
                            onChange={() => form.clearErrors()}
                        />
                        <RadioButton
                            label={AnnulleringÅrsak.Infotrygd}
                            name="årsak"
                            value={AnnulleringÅrsak.Infotrygd}
                            // @ts-ignore
                            radioRef={form.register({ required: true })}
                            onChange={() => form.clearErrors()}
                        />
                        <RadioButton
                            label={AnnulleringÅrsak.NyInfo}
                            name="årsak"
                            value={AnnulleringÅrsak.NyInfo}
                            // @ts-ignore
                            radioRef={form.register({ required: true })}
                            onChange={() => form.clearErrors()}
                        />
                        <RadioButton
                            label={AnnulleringÅrsak.Annet}
                            name="årsak"
                            value={AnnulleringÅrsak.Annet}
                            // @ts-ignore
                            radioRef={form.register({ required: true })}
                            onChange={() => form.clearErrors()}
                        />
                    </RadioGruppe>

                    <Controller
                        name="kommentar"
                        defaultValue=""
                        render={({ value, onChange }) => (
                            <Textarea
                                name="kommentar"
                                value={value}
                                description="Må ikke inneholde personopplysninger"
                                label={`Årsak`}
                                feil={form.errors.kommentar ? form.errors.kommentar.message : null}
                                onChange={(event: ChangeEvent) => {
                                    form.clearErrors('kommentar');
                                    onChange(event);
                                }}
                                aria-invalid={form.errors.kommentar?.message}
                                aria-errormessage={form.errors.kommentar?.message}
                                placeholder="Gi en kort forklaring på hvorfor du annullerte. Eksempel: Korrigerte opplysninger om ferie"
                                maxLength={0}
                            />
                        )}
                    />
                    <StyledKnapperad>
                        <AnnullerKnapp spinner={isSending} autoDisableVedSpinner>
                            Annullér
                        </AnnullerKnapp>
                        <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
                    </StyledKnapperad>
                    {postAnnulleringFeil && <Feilmelding>{postAnnulleringFeil}</Feilmelding>}
                </Form>
            </ModalContainer>
        </FormProvider>
    );
};
