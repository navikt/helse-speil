import React, { useContext } from 'react';
import { InnrapporteringContext } from '../../../context/InnrapporteringContext';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';

const Innrapportering = () => {
    const innrapportering = useContext(InnrapporteringContext);

    const sendRapporter = () => {
        // Send innholdet av innrapportering.uenigheter et eller annet sted
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
                            {uenighet.id} - <span>{uenighet.value}</span>
                        </Normaltekst>
                    ))}
                    <Knapp onClick={sendRapporter}>Send inn</Knapp>
                </>
            )}
        </Panel>
    )
};

export default Innrapportering;
