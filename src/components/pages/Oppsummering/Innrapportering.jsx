import React, { useContext, useState } from 'react';
import { InnrapporteringContext } from '../../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { postFeedback } from '../../../io/http';

const Innrapportering = withBehandlingContext(({ behandling }) => {
    const innrapportering = useContext(InnrapporteringContext);
    const [error, setError] = useState(undefined);

    const sendRapporter = () => {
        // Send innholdet av innrapportering.uenigheter et eller annet sted
        postFeedback({
            key: behandling.behandlingsId,
            value: JSON.stringify(innrapportering.uenigheter)
        }).catch(err => {
            setError(err.message);
        });
    };

    return (
        <Panel border>
            <Undertittel>Innrapportert</Undertittel>
            {innrapportering.uenigheter.length === 0 ? (
                <Normaltekst>Ingen uenigheter</Normaltekst>
            ) : (
                <>
                    {innrapportering.uenigheter.map((uenighet, i) => (
                        <Normaltekst key={`uenighet-${i}`}>
                            {uenighet.label} - <span>{uenighet.value}</span>
                        </Normaltekst>
                    ))}
                    <Knapp onClick={sendRapporter}>Send inn</Knapp>
                    {error && error}
                </>
            )}
        </Panel>
    );
});

export default Innrapportering;
