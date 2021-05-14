import React, {ChangeEvent, useState} from 'react';
import styled from '@emotion/styled';
import {Checkbox, Input, Radio, RadioGruppe, Textarea} from 'nav-frontend-skjema';
import {Feilmelding as NavFeilmelding, Normaltekst} from 'nav-frontend-typografi';
import {Flatknapp, Knapp} from 'nav-frontend-knapper';
import {AnnulleringDTO} from '../../../../io/types';
import {Person, Vedtaksperiode} from 'internal-types';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {authState} from '../../../../state/authentication';
import {postAbonnerPåAktør, postAnnullering} from '../../../../io/http';
import {Controller, FormProvider, useForm} from 'react-hook-form';
import {Annulleringsvarsel} from './Annulleringsvarsel';
import {Modal} from '../../../../components/Modal';
import {organisasjonsnummerForPeriode} from '../../../../mapping/selectors';
import {NORSK_DATOFORMAT} from '../../../../utils/date';
import {somPenger} from '../../../../utils/locale';
import {opptegnelsePollingTimeState} from '../../../../state/opptegnelser';

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

const IdentInput = styled(Input)`
    margin-top: 1.3125rem;
    margin-bottom: 1.5rem;

    label {
        display: none;
    }

    input {
        font-size: 1rem;
        color: var(--navds-color-text-primary);
    }
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
    margin-bottom: 2.5rem;
`;

const CheckboxTekst = styled.p`
    font-weight: bold;
    color: var(--navds-color-text-primary);
`;

const CheckboxFeilmelding = styled(NavFeilmelding)`
    margin-top: 0.5rem;
`;

const StyledKnapperad = styled.div`
    margin-top: 2.5rem;
`;

export enum AnnulleringÅrsak {
    Automatisk = 'Feil ble gjort i opprinnelig automatisk vedtak i ny løsning',
    Infotrygd = 'Feil ble gjort i opprinnelig vedtak i Infotrygd',
    NyInfo = 'Mottatt ny informasjon etter behandling',
    Annet = 'Annet',
}

interface Props {
    person: Person;
    vedtaksperiode: Vedtaksperiode;
    onClose: () => void;
}

export const Annulleringsmodal = ({ person, vedtaksperiode, onClose }: Props) => {
    const { ident } = useRecoilValue(authState);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [postAnnulleringFeil, setPostAnnulleringFeil] = useState<string>();
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

    const form = useForm({ mode: 'onBlur' });
    const organisasjonsnummer = organisasjonsnummerForPeriode(vedtaksperiode, person);

    const kommentar = form.watch('kommentar');
    const annenÅrsak = form.watch(`årsak`) === AnnulleringÅrsak.Annet;
    const harMinstÉnÅrsak = () => form.getValues()?.årsak ?? false;

    const annullering = (årsak: AnnulleringÅrsak, kommentar: string = ''): AnnulleringDTO => ({
        aktørId: person.aktørId,
        fødselsnummer: person.fødselsnummer,
        organisasjonsnummer: organisasjonsnummer,
        fagsystemId: vedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling?.fagsystemId!,
        kommentar: kommentar,
        årsak: årsak,
    });

    const sendAnnullering = (annullering: AnnulleringDTO) => {
        setIsSending(true);
        setPostAnnulleringFeil(undefined);
        postAnnullering(annullering)
            .then(() => {
                postAbonnerPåAktør(annullering.aktørId).then(() => {
                    setOpptegnelsePollingTime(1000);
                });
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

                    <Checkbox
                        name="arbeidsgiverCheckbox"
                        label={<CheckboxTekst>Annullér utbetaling til arbeidsgiver</CheckboxTekst>}
                        checkboxRef={form.register({ required: true })}
                    />
                    <Utbetalingsgruppe>
                        <TilAnnullering>
                            <Normaltekst>Følgende utbetalinger annulleres:</Normaltekst>
                            <ul>
                                {vedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling?.linjer.map((linje, index) => (
                                    <li key={index}>
                                        {linje.fom.format(NORSK_DATOFORMAT)} - {linje.tom.format(NORSK_DATOFORMAT)} -{' '}
                                        {somPenger(linje.dagsats)}
                                    </li>
                                ))}
                            </ul>
                        </TilAnnullering>
                        {form.errors?.arbeidsgiverCheckbox && (
                            <CheckboxFeilmelding>
                                Du må velge minst én utbetaling som skal annulleres
                            </CheckboxFeilmelding>
                        )}
                    </Utbetalingsgruppe>

                    <Normaltekst>
                        For å gjennomføre annulleringen må du skrive inn din NAV brukerident i feltet under.
                    </Normaltekst>
                    <IdentInput
                        name="identinput"
                        label={'NAV-identen din er nødvendig for at du kan annullere'}
                        aria-label={'NAV-identen din er nødvendig for at du kan annullere'}
                        placeholder={'NAV-identen din er nødvendig for at du kan annullere'}
                        inputRef={form.register({ required: true, validate: (value: string) => value === ident })}
                        feil={form.errors?.identinput && 'NAV-identen din er nødvendig for at du kan annullere'}
                    />

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
                        {postAnnulleringFeil && <Feilmelding>{postAnnulleringFeil}</Feilmelding>}
                    </StyledKnapperad>
                </Form>
            </ModalContainer>
        </FormProvider>
    );
};
