import React, { useContext, useState } from 'react';
import Icon from 'nav-frontend-ikoner-assets';
import { InnrapporteringContext } from '../../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { putFeedback } from '../../../io/http';
import './Innrapportering.less';

const Innrapportering = withBehandlingContext(({ behandling }) => {
    const innrapportering = useContext(InnrapporteringContext);
    const [error, setError] = useState(undefined);
    const [isSending, setIsSending] = useState(false);

    const sendRapporter = () => {
        setIsSending(true);
        putFeedback({
            id: behandling.behandlingsId,
            txt: JSON.stringify(
                innrapportering.uenigheter.map(uenighet => ({
                    label: uenighet.label,
                    value: uenighet.value
                }))
            )
        })
            .then(() => {
                setError(undefined);
                innrapportering.setHasSendt(true);
            })
            .catch(() => {
                setError('Feil ved innsending av rapport. Prøv igjen senere.');
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    return (
        <Panel className="Innrapportering" border>
            <Undertittel>Innrapportert</Undertittel>
            {innrapportering.uenigheter.length === 0 ? (
                <Normaltekst>Ingen uenigheter</Normaltekst>
            ) : (
                <>
                    {innrapportering.uenigheter.map((uenighet, i) => (
                        <Normaltekst key={`uenighet-${i}`}>
                            <span>{uenighet.label}:</span>
                            <span>{uenighet.value}</span>
                            {!uenighet.value && (
                                <span className="skjemaelement__feilmelding">
                                    Du må fylle ut årsak.
                                </span>
                            )}
                        </Normaltekst>
                    ))}
                    {innrapportering.uenigheter.some(
                        uenighet => !uenighet.value
                    ) && (
                        <Normaltekst className="skjemaelement__feilmelding">
                            Felter uten oppgitt årsak blir ikke sendt inn.
                        </Normaltekst>
                    )}
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
                            {error}
                        </Normaltekst>
                    )}
                </>
            )}
        </Panel>
    );
});

export default Innrapportering;
