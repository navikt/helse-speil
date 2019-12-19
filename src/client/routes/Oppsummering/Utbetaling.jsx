import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { oppsummeringstekster } from '../../tekster';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import React, { useContext, useEffect, useState } from 'react';
import { fetchPerson, postAnnullering, postVedtak } from '../../io/http';
import { SaksoversiktContext } from '../../context/SaksoversiktContext';
import { PersonContext } from '../../context/PersonContext';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Utbetaling.less';
import InfoModal from '../../components/InfoModal';
import VisModalButton from '../Inngangsvilkår/VisModalButton';
import AnnulleringsModal from './AnnulleringsModal';
import { AuthContext } from '../../context/AuthContext';
import { enesteSak, utbetalingsreferanse } from '../../context/mapper';

const BESLUTNING = { GODKJENT: 'GODKJENT', AVVIST: 'AVVIST' };
const TILSTAND = {
    TIL_GODKJENNING: 'TIL_GODKJENNING',
    TIL_UTBETALING: 'TIL_UTBETALING',
    TIL_INFOTRYGD: 'TIL_INFOTRYGD'
};

const Utbetaling = () => {
    const { saksoversikt } = useContext(SaksoversiktContext);
    const { personTilBehandling, innsyn, hentPerson } = useContext(PersonContext);
    const { ident } = useContext(AuthContext).authInfo;
    const [isSending, setIsSending] = useState(false);
    const [beslutning, setBeslutning] = useState(undefined);
    const [sendtAnnullering, setSendtAnnullering] = useState(false);
    const [senderAnnullering, setSenderAnnullering] = useState(false);
    const [error, setError] = useState(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [annulleringsmodalOpen, setAnnulleringsmodalOpen] = useState(false);
    const tilstand = enesteSak(personTilBehandling).tilstandType;

    const fattVedtak = godkjent => {
        const behovId = saksoversikt.find(behov => behov.aktørId === personTilBehandling.aktørId)?.[
            '@id'
        ];
        setIsSending(true);
        postVedtak(behovId, personTilBehandling.aktørId, godkjent)
            .then(() => {
                setBeslutning(godkjent ? BESLUTNING.GODKJENT : BESLUTNING.AVVIST);
                setError(undefined);
            })
            .catch(err => setError({ message: 'Feil under fatting av vedtak' }))
            .finally(() => {
                setIsSending(false);
                setModalOpen(false);
            });
    };

    const sendAnnullering = utbetalingsreferanse => {
        postAnnullering(
            utbetalingsreferanse ?? personTilBehandling.oppsummering.utbetalingsreferanse,
            personTilBehandling.aktørId
        )
            .then(() => {
                setSendtAnnullering(true);
                setError(undefined);
            })
            .catch(err => {
                console.error({ err });
                if (err.status === 409) {
                    setError({ message: 'Denne saken er allerede sendt til annullering.' });
                } else {
                    setError({ message: 'Kunne ikke sende annullering. Prøv igjen senere.' });
                }
            })
            .finally(() => {
                setAnnulleringsmodalOpen(false);
                setSenderAnnullering(false);
            });
    };

    const annullerUtbetaling = () => {
        setSenderAnnullering(true);
        if (personTilBehandling.oppsummering.utbetalingsreferanse === undefined) {
            let utbetalingsref;
            fetchPerson(personTilBehandling.aktørId)
                .then(response => {
                    utbetalingsref = utbetalingsreferanse(response.data.person);
                })
                .catch(err => console.error(err.message))
                .finally(() => sendAnnullering(utbetalingsref));
        } else {
            sendAnnullering();
        }
    };

    const Annuleringslinje = () => (
        <Normaltekst className="Annuleringslinje">
            Er det feil i utbetalingen er det mulig å{' '}
            <VisModalButton
                onClick={() => setAnnulleringsmodalOpen(true)}
                tekst="annullere utbetalingen fra oppdragssystemet"
            />
        </Normaltekst>
    );

    return (
        <Panel className="Utbetaling">
            {modalOpen && (
                <InfoModal
                    onClose={() => setModalOpen(false)}
                    onApprove={() => fattVedtak(true)}
                    isSending={isSending}
                    infoMessage="Når du trykker ja blir utbetalingen sendt til oppdragsystemet."
                />
            )}
            {annulleringsmodalOpen && (
                <AnnulleringsModal
                    onClose={() => setAnnulleringsmodalOpen(false)}
                    onApprove={annullerUtbetaling}
                    faktiskNavIdent={ident}
                    senderAnnullering={senderAnnullering}
                />
            )}
            <Undertittel>{oppsummeringstekster('utbetaling')}</Undertittel>
            <AlertStripeAdvarsel>
                Utbetaling skal kun skje hvis det ikke er funnet feil. Feil meldes umiddelbart inn
                til teamet for evaluering.
            </AlertStripeAdvarsel>
            {sendtAnnullering ? (
                <AlertStripeInfo>Utbetalingen er sendt til annullering.</AlertStripeInfo>
            ) : (tilstand === TILSTAND.TIL_GODKJENNING && beslutning === BESLUTNING.GODKJENT) ||
              tilstand === TILSTAND.TIL_UTBETALING ? (
                <div>
                    <AlertStripeInfo>Utbetalingen er sendt til oppdragsystemet.</AlertStripeInfo>
                    <Annuleringslinje />
                </div>
            ) : !innsyn && tilstand === TILSTAND.TIL_GODKJENNING ? (
                beslutning ? (
                    <AlertStripeInfo>Saken er sendt til behandling i Infotrygd.</AlertStripeInfo>
                ) : (
                    <div className="knapperad">
                        <div className="knapp--utbetaling">
                            <button onClick={() => setModalOpen(true)}>Utbetal</button>
                        </div>
                        <Knapp onClick={() => fattVedtak(false)} spinner={isSending && !modalOpen}>
                            Behandle i Infotrygd
                        </Knapp>
                    </div>
                )
            ) : (
                <AlertStripeInfo>
                    {tilstand === TILSTAND.TIL_INFOTRYGD
                        ? 'Saken er sendt til behandling i Infotrygd.'
                        : innsyn && tilstand === TILSTAND.TIL_GODKJENNING
                        ? 'Saken står til godkjenning av saksbehandler.'
                        : 'Kunne ikke lese informasjon om sakens tilstand.'}
                </AlertStripeInfo>
            )}
            {error && (
                <Normaltekst className="skjemaelement__feilmelding">
                    {error.message || 'En feil har oppstått.'}
                    {error.statusCode === 401 && <a href="/"> Logg inn</a>}
                </Normaltekst>
            )}
        </Panel>
    );
};

export default Utbetaling;
