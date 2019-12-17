import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { oppsummeringstekster } from '../../tekster';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import React, { useContext, useState } from 'react';
import { postAnnullering, postVedtak } from '../../io/http';
import { SaksoversiktContext } from '../../context/SaksoversiktContext';
import { PersonContext } from '../../context/PersonContext';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Utbetaling.less';
import InfoModal from '../../components/InfoModal';
import VisModalButton from '../Inngangsvilkår/VisModalButton';
import AnnulleringsModal from './AnnulleringsModal';
import { AuthContext } from '../../context/AuthContext';

const BESLUTNING = { GODKJENT: 'GODKJENT', AVVIST: 'AVVIST' };
const TILSTAND = {
    TIL_GODKJENNING: 'TIL_GODKJENNING',
    TIL_UTBETALING: 'TIL_UTBETALING',
    TIL_INFOTRYGD: 'TIL_INFOTRYGD'
};

const Utbetaling = () => {
    const { saksoversikt } = useContext(SaksoversiktContext);
    const { personTilBehandling, innsyn } = useContext(PersonContext);
    const { ident } = useContext(AuthContext).authInfo;
    const [isSending, setIsSending] = useState(false);
    const [beslutning, setBeslutning] = useState(undefined);
    const [sendtAnnullering, setSendtAnnullering] = useState(false);
    const [error, setError] = useState(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [annulleringsmodalOpen, setAnnulleringsmodalOpen] = useState(false);
    const tilstand = personTilBehandling.arbeidsgivere?.[0].saker?.[0].tilstandType;

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
            .catch(err => setError(err))
            .finally(() => {
                setIsSending(false);
                setModalOpen(false);
            });
    };

    const annullerUtbetaling = () => {
        postAnnullering(
            personTilBehandling.oppsummering.utbetalingsreferanse,
            personTilBehandling.aktørId
        )
            .then(() => {
                setSendtAnnullering(true);
                setError(undefined);
            })
            .catch(err => {
                setError({ message: err.message });
            })
            .finally(() => {
                setAnnulleringsmodalOpen(false);
            });
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
                    infoMessage="Når du trykker ja blir utbetalingen sendt til oppdragsystemet. Dette kan ikke angres."
                />
            )}
            {annulleringsmodalOpen && (
                <AnnulleringsModal
                    onClose={() => setAnnulleringsmodalOpen(false)}
                    onApprove={annullerUtbetaling}
                    faktiskNavIdent={ident}
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
