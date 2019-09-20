import React, { useEffect, useState } from 'react';
import './Personinfo.less';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { getPerson } from '../../../io/http';

const Personinfo = withBehandlingContext(({ behandling, fnr }) => {
    const { aktorId } = behandling.originalSøknad;
    const [person, setPerson] = useState();

    useEffect(() => {
        getPerson(aktorId)
            .then(response => {
                response.data && setPerson(response.data);
            })
            .catch(err => {
                console.error('Feil ved henting av person.', err);
                setPerson({
                    navn: 'Navn ikke tilgjengelig',
                    kjønn: 'Ikke tilgjengelig'
                });
            });
    }, [behandling]);

    return (
        <>
            {person && (
                <div className="personalia-linje">
                    <figure
                        id="personinfo-kjønn"
                        aria-label={`Kjønn: ${person.kjønn}`}
                        className={person.kjønn.toLowerCase()}
                    />
                    <Element>{person.navn}</Element>
                    <Undertekst>Fødselsnummer: {fnr || 'Ikke tilgjengelig'}</Undertekst>
                    <Undertekst>Aktør-ID: {aktorId}</Undertekst>
                </div>
            )}
        </>
    );
});

export default Personinfo;
