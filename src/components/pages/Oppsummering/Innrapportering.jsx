import React, { useContext, useEffect, useState } from 'react';
import Icon from 'nav-frontend-ikoner-assets';
import Kommentarer from './Kommentarer';
import { InnrapporteringContext } from '../../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import { putFeedback } from '../../../io/http';
import { oppsummeringstekster } from '../../../tekster';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import './Innrapportering.less';
import moment from 'moment';
import { Checkbox } from 'nav-frontend-skjema';

const Innrapportering = withBehandlingContext(({ behandling }) => {
    const innrapportering = useContext(InnrapporteringContext);
    const [error, setError] = useState(undefined);
    const [isSending, setIsSending] = useState(false);
    const [validationError, setValidationError] = useState(false);

    useEffect(() => {
        if (innrapportering.kommentarer !== '' || innrapportering.godkjent) {
            setValidationError(false);
        }
    }, [innrapportering.kommentarer === '', innrapportering.godkjent]);

    const sendRapporter = () => {
        setIsSending(true);
        putFeedback({
            id: behandling.behandlingsId,
            txt: JSON.stringify({
                uenigheter: innrapportering.uenigheter,
                kommentarer: innrapportering.kommentarer,
                godkjent: innrapportering.godkjent,
                submittedDate: moment().format()
            })
        })
            .then(() => {
                setError(undefined);
                innrapportering.setHasSendt(true); //TODO: Håndtere 'hasSendt' på en bedre måte
                history.push('/');
            })
            .catch(e => {
                setError(e);
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    const onGodkjentChange = e => {
        innrapportering.setGodkjent(e.target.checked);
    };

    const validate = () => {
        if (
            innrapportering.uenigheter.length > 0 ||
            innrapportering.kommentarer !== '' ||
            innrapportering.godkjent
        ) {
            sendRapporter();
        } else {
            setValidationError(true);
            setError(undefined);
        }
    };

    return (
        <Panel className="Innrapportering" border>
            <Undertittel>{oppsummeringstekster('innrapportert')}</Undertittel>
            <Normaltekst className="Innrapportering__category">Uenigheter</Normaltekst>
            {innrapportering.uenigheter.length === 0 && (
                <Normaltekst>{oppsummeringstekster('ingen_uenigheter')}</Normaltekst>
            )}
            {innrapportering.uenigheter.map((uenighet, i) => (
                <Normaltekst key={`uenighet-${i}`} className="Innrapportering__uenighet">
                    <span>{uenighet.label}:</span>
                    <span>{uenighet.value}</span>
                    {!uenighet.value && (
                        <span className="skjemaelement__feilmelding">
                            {oppsummeringstekster('oppgi_årsak')}
                        </span>
                    )}
                </Normaltekst>
            ))}
            <Kommentarer />
            <div className={`checkbox${innrapportering.uenigheter.length > 0 ? ' disabled' : ''}`}>
                <span className="checkbox__tooltip">Du er uenig med maskinen</span>
                <Checkbox
                    defaultChecked={innrapportering.godkjent}
                    onChange={onGodkjentChange}
                    label="Jeg er enig med maskinen"
                    disabled={innrapportering.uenigheter.length > 0}
                />
            </div>
            {innrapportering.hasSendt ? (
                <Knapp className="sendt" disabled>
                    Rapport mottatt
                    <Icon kind="ok-sirkel-fyll" size={20} />
                </Knapp>
            ) : (
                <>
                    <Knapp onClick={validate} spinner={isSending}>
                        Send inn
                    </Knapp>
                    {validationError && (
                        <Normaltekst className="skjemaelement__feilmelding">
                            Huk av for at du er enig med maskinen dersom du ikke har noen
                            kommentarer.
                        </Normaltekst>
                    )}
                </>
            )}
            {error && (
                <Normaltekst className="skjemaelement__feilmelding">
                    {error.statusCode === 401 ? (
                        <>
                            <span>
                                Du må logge inn på nytt for å kunne sende rapport. Du vil sendes
                                tilbake til forsiden etter innlogging og beholder arbeidet du har
                                gjort.
                            </span>
                            <a href="/"> Logg inn</a>
                        </>
                    ) : (
                        <>Feil ved innsending av rapport. Prøv igjen senere.</>
                    )}
                </Normaltekst>
            )}
        </Panel>
    );
});

export default Innrapportering;
