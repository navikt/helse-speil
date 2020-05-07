import React, { useContext, useEffect, useState } from 'react';
import Modal from 'nav-frontend-modal';
import styled from '@emotion/styled';
import Ikonrad from '../Ikonrad';
import { Input } from 'nav-frontend-skjema';
import { Feilmelding, Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Annulleringslinje } from './Annulleringslinje';
import { AnnulleringDTO } from '../../io/http';
import { PersonContext } from '../../context/PersonContext';

Modal.setAppElement('#root');

interface Props {
    isSending: boolean;
    onApprove: (annullering: AnnulleringDTO) => void;
    onClose: () => void;
    ident: string;
    feilmelding?: string;
}

const Advarsel = styled(Ikonrad)`
    margin-bottom: 2rem;
    padding: 0;

    p {
        max-width: 31.25rem;
        font-weight: 600;
    }
`;

const Tittel = styled.h1`
    font-size: 1.5rem;
    font-weight: 600;
    color: #3e3832;
    margin-bottom: 1.5rem;
`;

const ModalContainer = styled(Modal)`
    max-width: 48rem;
    padding: 3.5rem;

    .skjemaelement__feilmelding {
        font-style: normal;
    }
`;

const Failsafe = styled(Input)`
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

const UtbetalingIkkeValgtFeilmelding = styled(Feilmelding)`
    margin-top: 0.625rem;
`;

const AnnulleringskallFeiletFeilmelding = UtbetalingIkkeValgtFeilmelding;

export const AnnulleringModal = ({ isSending, onApprove, onClose, ident, feilmelding }: Props) => {
    const [navidentInput, setNavidentInput] = useState('');
    const [navidentGyldig, setNavIdentGyldig] = useState<boolean | undefined>(undefined);
    const [arbeidsgiverChecked, setArbeidsgiverChecked] = useState(false);
    const [brukerChecked, setBrukerChecked] = useState(false);
    const [minstEnCheckboxMarkert, setMinstEnCheckboxMarkert] = useState<boolean | undefined>(undefined);

    const { personTilBehandling, aktivVedtaksperiode } = useContext(PersonContext);
    const { aktørId, fødselsnummer } = personTilBehandling!;
    const vedtaksperiode = aktivVedtaksperiode!;

    const organisasjonsnummer = personTilBehandling?.arbeidsgivere.find(
        arbeidsgiver => arbeidsgiver.vedtaksperioder.find(periode => periode.id === vedtaksperiode.id) !== undefined
    )?.organisasjonsnummer!;

    useEffect(() => {
        if (minstEnCheckboxMarkert === false) setMinstEnCheckboxMarkert(undefined);
    }, [arbeidsgiverChecked, brukerChecked]);

    useEffect(() => {
        if (navidentGyldig === false) setNavIdentGyldig(undefined);
    }, [navidentInput]);

    const valider = () => {
        const navidentGyldig = navidentInput === ident;
        setNavIdentGyldig(navidentGyldig);
        setMinstEnCheckboxMarkert(brukerChecked || arbeidsgiverChecked);

        if (brukerChecked && navidentGyldig)
            onApprove({
                aktørId,
                fødselsnummer,
                organisasjonsnummer,
                fagsystemId: vedtaksperiode.utbetalinger!.personUtbetaling!.fagsystemId,
                vedtaksperiodeId: vedtaksperiode.id
            });

        if (arbeidsgiverChecked && navidentGyldig)
            onApprove({
                aktørId,
                fødselsnummer,
                organisasjonsnummer,
                fagsystemId: vedtaksperiode.utbetalinger!.arbeidsgiverUtbetaling!.fagsystemId,
                vedtaksperiodeId: vedtaksperiode.id
            });
    };

    return (
        <ModalContainer
            id="modal"
            className="AnnulleringModal"
            isOpen={true}
            contentLabel="Feilmelding"
            closeButton={true}
            onRequestClose={onClose}
        >
            <Advarsel
                tekst={
                    'Hvis du annullerer utbetaling vil det fjernes fra' +
                    ' oppdragssystemet og du må behandle saken manuelt i Infotrygd.'
                }
                ikontype={'advarsel'}
            />
            <Tittel>Annullering</Tittel>
            {vedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling &&
                vedtaksperiode.utbetalinger.arbeidsgiverUtbetaling.linjer.length > 0 && (
                    <Annulleringslinje
                        label={'Annuller utbetaling til arbeidsgiver'}
                        linjer={vedtaksperiode.utbetalinger.arbeidsgiverUtbetaling.linjer}
                        checked={arbeidsgiverChecked}
                        setChecked={setArbeidsgiverChecked}
                    />
                )}
            {vedtaksperiode.utbetalinger?.personUtbetaling &&
                vedtaksperiode.utbetalinger.personUtbetaling.linjer.length > 0 && (
                    <Annulleringslinje
                        label={'Annuller utbetaling til bruker'}
                        linjer={vedtaksperiode.utbetalinger.personUtbetaling.linjer}
                        checked={brukerChecked}
                        setChecked={setBrukerChecked}
                    />
                )}
            <Normaltekst>
                For å gjennomføre annulleringen må du skrive inn din NAV brukerident i feltet under.
            </Normaltekst>
            <Failsafe
                label={'NAV brukerident'}
                aria-label={'NAV brukerident'}
                placeholder={'NAV brukerident'}
                value={navidentInput}
                onChange={event => setNavidentInput(event.target.value)}
                feil={navidentGyldig === false && 'Fyll inn din NAV brukerident'}
            />
            <AnnullerKnapp spinner={isSending} autoDisableVedSpinner onClick={valider}>
                Annuller
            </AnnullerKnapp>
            <Flatknapp onClick={onClose}>Avbryt</Flatknapp>
            {minstEnCheckboxMarkert === false && (
                <UtbetalingIkkeValgtFeilmelding>Du må velge hva som skal annulleres</UtbetalingIkkeValgtFeilmelding>
            )}
            {feilmelding && <AnnulleringskallFeiletFeilmelding>{feilmelding}</AnnulleringskallFeiletFeilmelding>}
        </ModalContainer>
    );
};
