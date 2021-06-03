import styled from '@emotion/styled';
import { Person, Vedtaksperiode } from 'internal-types';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Checkbox, Input } from 'nav-frontend-skjema';
import { Feilmelding as NavFeilmelding, Normaltekst } from 'nav-frontend-typografi';

import { Modal } from '../../../../components/Modal';
import { postAbonnerPåAktør, postAnnullering } from '../../../../io/http';
import { AnnulleringDTO } from '../../../../io/types';
import { Tidslinjeperiode, useUtbetaling } from '../../../../modell/UtbetalingshistorikkElement';
import { authState } from '../../../../state/authentication';
import { opptegnelsePollingTimeState } from '../../../../state/opptegnelser';
import { usePerson } from '../../../../state/person';
import { useVedtaksperiode } from '../../../../state/tidslinje';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { somPenger } from '../../../../utils/locale';

import { Annulleringsvarsel } from './Annulleringsvarsel';

const ModalContainer = styled(Modal)`
    max-width: 48rem;

    .skjemaelement__feilmelding {
        font-style: normal;
    }
`;

const Form = styled.form`
    padding: 0.5rem 2.5rem 2.5rem;
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

const CheckboxTekst = styled.p`
    font-weight: bold;
    color: var(--navds-color-text-primary);
`;

const CheckboxFeilmelding = styled(NavFeilmelding)`
    margin-top: 0.5rem;
`;

interface Props {
    person: Person;
    aktivPeriode: Tidslinjeperiode;
    onClose: () => void;
}

export const Annulleringsmodal = ({ person, aktivPeriode, onClose }: Props) => {
    const { ident } = useRecoilValue(authState);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [postAnnulleringFeil, setPostAnnulleringFeil] = useState<string>();
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);
    const vedtaksperiode = useVedtaksperiode(aktivPeriode.id);
    const utbetaling = useUtbetaling(aktivPeriode.beregningId);

    const form = useForm({ mode: 'onBlur' });
    const annullering = (): AnnulleringDTO => ({
        aktørId: person.aktørId,
        fødselsnummer: person.fødselsnummer,
        organisasjonsnummer: aktivPeriode.organisasjonsnummer,
        fagsystemId: utbetaling?.arbeidsgiverFagsystemId!,
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

    const submit = () => sendAnnullering(annullering());

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
                        label={'NAV brukerident'}
                        aria-label={'NAV brukerident'}
                        placeholder={'NAV brukerident'}
                        inputRef={form.register({ required: true, validate: (value: string) => value === ident })}
                        feil={form.errors?.identinput && 'Fyll inn din NAV brukerident'}
                    />
                    <AnnullerKnapp spinner={isSending} autoDisableVedSpinner>
                        Annullér
                    </AnnullerKnapp>
                    <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
                    {postAnnulleringFeil && <Feilmelding>{postAnnulleringFeil}</Feilmelding>}
                </Form>
            </ModalContainer>
        </FormProvider>
    );
};
