import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { oppsummeringstekster } from '../../tekster';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import React, { useContext, useState } from 'react';
import { postVedtak } from '../../io/http';
import { PersonoversiktContext } from '../../context/PersonoversiktContext';
import { PersonContext } from '../../context/PersonContext';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import './Utbetaling.less';

const BESLUTNING = { GODKJENT: 'GODKJENT', AVVIST: 'AVVIST' };

const Utbetaling = () => {
    const { personoversikt } = useContext(PersonoversiktContext);
    const { personTilBehandling } = useContext(PersonContext);
    const [isSending, setIsSending] = useState(false);
    const [beslutning, setBeslutning] = useState(undefined);
    const [error, setError] = useState(undefined);

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
            .finally(() => setIsSending(false));
    };

    return (
        <Panel className="Utbetaling">
            <Undertittel>{oppsummeringstekster('utbetaling')}</Undertittel>
            <AlertStripeAdvarsel>
                Utbetaling skal kun skje hvis det ikke er funnet feil. Feil meldes umiddelbart inn
                til teamet for evaluering.
            </AlertStripeAdvarsel>
            {beslutning ? (
                <Normaltekst>
                    {beslutning === BESLUTNING.GODKJENT
                        ? 'Saken er godkjent og sendt til utbetaling'
                        : 'Saken er registrert som avvist. Husk å prate med teamet om grunnen.'}
                </Normaltekst>
            ) : (
                <div className="knapperad">
                    <div className="knapp--utbetaling">
                        <button onClick={() => fattVedtak(true)} spinner={isSending}>
                            Utbetal
                        </button>
                    </div>
                    <Knapp onClick={() => fattVedtak(false)} spinner={isSending}>
                        Avvis
                    </Knapp>
                </div>
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
