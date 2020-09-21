import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Input } from 'nav-frontend-skjema';
import { Feilmelding as NavFeilmelding, Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { AnnulleringDTO } from '../../io/types';
import { Person, Utbetaling, Vedtaksperiode } from 'internal-types';
import { useRecoilValue } from 'recoil';
import { authState } from '../../state/authentication';
import { postAnnullering } from '../../io/http';
import { FormProvider, useForm } from 'react-hook-form';
import { Annulleringsvarsel } from './Annulleringsvarsel';
import { AnnullerbarUtbetaling } from './AnnullerbarUtbetaling';
import { Modal } from '../Modal';
import { organisasjonsnummerForPeriode } from '../../mapping/selectors';

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

const Utbetalinger = styled.div`
    margin-bottom: 2rem;
`;

interface Props {
    person: Person;
    vedtaksperiode: Vedtaksperiode;
    onClose: () => void;
}

export const Annulleringsmodal = ({ person, vedtaksperiode, onClose }: Props) => {
    const { ident } = useRecoilValue(authState);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [postAnnulleringFeil, setPostAnnulleringFeil] = useState<string>();

    const form = useForm({ mode: 'onBlur' });
    const brukerChecked = form.getValues('person');
    const arbeidsgiverChecked = form.getValues('arbeidsgiver');
    const organisasjonsnummer = organisasjonsnummerForPeriode(vedtaksperiode, person);

    const annullering = (utbetaling: Utbetaling): AnnulleringDTO => ({
        aktørId: person.aktørId,
        fødselsnummer: person.fødselsnummer,
        organisasjonsnummer: organisasjonsnummer,
        fagsystemId: utbetaling.fagsystemId,
        vedtaksperiodeId: vedtaksperiode.id,
    });

    const annulleringForPerson = () => annullering(vedtaksperiode.utbetalinger!.personUtbetaling!);

    const annulleringForArbeidsgiver = () => annullering(vedtaksperiode.utbetalinger!.arbeidsgiverUtbetaling!);

    const sendAnnullering = (annullering: AnnulleringDTO) => {
        setIsSending(true);
        setPostAnnulleringFeil(undefined);
        postAnnullering(annullering)
            .then(onClose)
            .catch(() => setPostAnnulleringFeil('Noe gikk galt. Prøv igjen senere eller kontakt en utvikler.'))
            .finally(() => setIsSending(false));
    };

    const valider = () => {
        if (!brukerChecked && !arbeidsgiverChecked) {
            form.setError('utbetalingIkkeValgt', {
                type: 'manual',
                message: 'Du må velge minst én utbetaling som skal annulleres.',
            });
        }
        if (brukerChecked && form.formState.isValid) sendAnnullering(annulleringForPerson());
        if (arbeidsgiverChecked && form.formState.isValid) sendAnnullering(annulleringForArbeidsgiver());
    };

    return (
        <FormProvider {...form}>
            <ModalContainer
                className="AnnulleringModal"
                isOpen={true}
                contentLabel="Feilmelding"
                onRequestClose={onClose}
            >
                <Form onSubmit={form.handleSubmit(valider)}>
                    <Annulleringsvarsel />
                    <Tittel>Annullering</Tittel>
                    <Utbetalinger>
                        {vedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling && (
                            <AnnullerbarUtbetaling
                                mottaker="arbeidsgiver"
                                utbetaling={vedtaksperiode.utbetalinger.arbeidsgiverUtbetaling}
                            />
                        )}
                        {vedtaksperiode.utbetalinger?.personUtbetaling && (
                            <AnnullerbarUtbetaling
                                mottaker="person"
                                utbetaling={vedtaksperiode.utbetalinger.personUtbetaling}
                            />
                        )}
                        {form.errors?.utbetalingIkkeValgt && (
                            <Feilmelding>{form.errors.utbetalingIkkeValgt.message}</Feilmelding>
                        )}
                    </Utbetalinger>
                    <Normaltekst>
                        For å gjennomføre annulleringen må du skrive inn din NAV brukerident i feltet under.
                    </Normaltekst>
                    <IdentInput
                        name="failsafe"
                        label={'NAV brukerident'}
                        aria-label={'NAV brukerident'}
                        placeholder={'NAV brukerident'}
                        inputRef={form.register({ required: true, validate: (value: string) => value === ident })}
                        feil={form.errors?.failsafe && 'Fyll inn din NAV brukerident'}
                    />
                    <AnnullerKnapp spinner={isSending} autoDisableVedSpinner onClick={valider}>
                        Annullér
                    </AnnullerKnapp>
                    <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
                    {postAnnulleringFeil && <Feilmelding>{postAnnulleringFeil}</Feilmelding>}
                </Form>
            </ModalContainer>
        </FormProvider>
    );
};
