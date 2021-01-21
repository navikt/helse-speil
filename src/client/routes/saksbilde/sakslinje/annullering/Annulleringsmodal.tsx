import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Checkbox, Input } from 'nav-frontend-skjema';
import { Feilmelding as NavFeilmelding, Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { AnnulleringDTO } from '../../../../io/types';
import { Person, Vedtaksperiode } from 'internal-types';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../../state/authentication';
import { postAnnullering } from '../../../../io/http';
import { FormProvider, useForm } from 'react-hook-form';
import { Annulleringsvarsel } from './Annulleringsvarsel';
import { Modal } from '../../../../components/Modal';
import { organisasjonsnummerForPeriode } from '../../../../mapping/selectors';
import { NORSK_DATOFORMAT } from '../../../../utils/date';
import { somPenger } from '../../../../utils/locale';
import { useHistory } from 'react-router';

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
    color: #3e3832;
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
        color: #3e3832;
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
    color: #3e3832;
`;

const CheckboxFeilmelding = styled(NavFeilmelding)`
    margin-top: 0.5rem;
`;

interface Props {
    person: Person;
    vedtaksperiode: Vedtaksperiode;
    onClose: () => void;
}

export const Annulleringsmodal = ({ person, vedtaksperiode, onClose }: Props) => {
    const history = useHistory();
    const { ident } = useRecoilValue(authState);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [postAnnulleringFeil, setPostAnnulleringFeil] = useState<string>();

    const form = useForm({ mode: 'onBlur' });
    const organisasjonsnummer = organisasjonsnummerForPeriode(vedtaksperiode, person);

    const annullering = (): AnnulleringDTO => ({
        aktørId: person.aktørId,
        fødselsnummer: person.fødselsnummer,
        organisasjonsnummer: organisasjonsnummer,
        fagsystemId: vedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling?.fagsystemId!,
    });

    const sendAnnullering = (annullering: AnnulleringDTO) => {
        setIsSending(true);
        setPostAnnulleringFeil(undefined);
        postAnnullering(annullering)
            .then(() => {
                onClose();
                history.push('/');
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
