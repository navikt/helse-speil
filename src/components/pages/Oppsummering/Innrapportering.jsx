import React, { useContext, useState } from 'react';
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
                innrapportering.setHasSendt(true);
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

    return (
        <Panel className="Innrapportering" border>
            <Undertittel>{oppsummeringstekster('innrapportert')}</Undertittel>
            <Normaltekst className="Innrapportering__category">
                Uenigheter
            </Normaltekst>
            {innrapportering.uenigheter.length === 0 && (
                <Normaltekst>
                    {oppsummeringstekster('ingen_uenigheter')}
                </Normaltekst>
            )}
            {innrapportering.uenigheter.map((uenighet, i) => (
                <Normaltekst
                    key={`uenighet-${i}`}
                    className="Innrapportering__uenighet"
                >
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
            <Checkbox
                defaultChecked={innrapportering.godkjent}
                onChange={onGodkjentChange}
                label="Jeg er enig med maskinen"
            />
            {innrapportering.hasSendt ? (
                <Knapp className="sendt" disabled>
                    Rapport mottatt
                    <Icon kind="ok-sirkel-fyll" size={20} />
                </Knapp>
            ) : (
                <Knapp onClick={sendRapporter} spinner={isSending}>
                    Send inn
                </Knapp>
            )}
            {error && (
                <Normaltekst className="skjemaelement__feilmelding">
                    {error.statusCode === 401 ? (
                        <>
                            <span>
                                Du må logge inn på nytt for å kunne sende
                                rapport. Du vil sendes tilbake til forsiden
                                etter innlogging og beholder arbeidet du har
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
