import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { oppsummeringstekster } from '../../tekster';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import React, { useContext, useState } from 'react';
import { postVedtak } from '../../io/http';
import { PersonoversiktContext } from '../../context/PersonoversiktContext';
import { PersonContext } from '../../context/PersonContext';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Utbetaling.less';
import InfoModal from '../../components/InfoModal';

const BESLUTNING = { GODKJENT: 'GODKJENT', AVVIST: 'AVVIST' };
const TILSTAND = {
    TIL_GODKJENNING: 'TIL_GODKJENNING',
    TIL_UTBETALING: 'TIL_UTBETALING',
    TIL_INFOTRYGD: 'TIL_INFOTRYGD'
};

const Utbetaling = () => {
    const { personoversikt } = useContext(PersonoversiktContext);
    const { personTilBehandling, innsyn } = useContext(PersonContext);
    const [isSending, setIsSending] = useState(false);
    const [beslutning, setBeslutning] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const tilstand = personTilBehandling.arbeidsgivere?.[0].saker?.[0].tilstandType;

    const fattVedtak = godkjent => {
        const behovId = personoversikt.find(
            behov => behov.aktørId === personTilBehandling.aktørId
        )?.['@id'];
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
            <Undertittel>{oppsummeringstekster('utbetaling')}</Undertittel>
            <AlertStripeAdvarsel>
                Utbetaling skal kun skje hvis det ikke er funnet feil. Feil meldes umiddelbart inn
                til teamet for evaluering.
            </AlertStripeAdvarsel>
            {!innsyn && tilstand === TILSTAND.TIL_GODKJENNING ? (
                beslutning ? (
                    <AlertStripeInfo>
                        {beslutning === BESLUTNING.GODKJENT
                            ? 'Utbetalingen er sendt til oppdragsystemet.'
                            : 'Saken er sendt til behandling i Infotrygd.'}
                    </AlertStripeInfo>
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
                    {tilstand === TILSTAND.TIL_UTBETALING
                        ? 'Utbetalingen er sendt til oppdragsystemet.'
                        : tilstand === TILSTAND.TIL_INFOTRYGD
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
