import React, { useContext, useState } from 'react';
import Icon from 'nav-frontend-ikoner-assets';
import { InnrapporteringContext } from '../../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { putFeedback } from '../../../io/http';
import './Innrapportering.less';
import { oppsummeringstekster } from '../../../tekster';

const Innrapportering = withBehandlingContext(({ behandling }) => {
    const innrapportering = useContext(InnrapporteringContext);
    const [error, setError] = useState(undefined);
    const [isSending, setIsSending] = useState(false);

    const sendRapporter = () => {
        setIsSending(true);
        putFeedback({
            id: behandling.behandlingsId,
            txt: JSON.stringify(
                innrapportering.uenigheter
                    .filter(
                        uenighet => uenighet.value && uenighet.value.length > 0
                    )
                    .map(uenighet => ({
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
            <Undertittel>{oppsummeringstekster('innrapportert')}</Undertittel>
            {innrapportering.uenigheter.length === 0 ? (
                <Normaltekst>
                    {oppsummeringstekster('ingen_uenigheter')}
                </Normaltekst>
            ) : (
                <>
                    {innrapportering.uenigheter.map((uenighet, i) => (
                        <Normaltekst key={`uenighet-${i}`}>
                            <span>{uenighet.label}:</span>
                            <span>{uenighet.value}</span>
                            {!uenighet.value && (
                                <span className="skjemaelement__feilmelding">
                                    {oppsummeringstekster('oppgi_årsak')}
                                </span>
                            )}
                        </Normaltekst>
                    ))}
                    {innrapportering.uenigheter.some(
                        uenighet => !uenighet.value
                    ) && (
                        <Normaltekst className="skjemaelement__feilmelding">
                            {oppsummeringstekster('felter_uten_årsak')}
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
