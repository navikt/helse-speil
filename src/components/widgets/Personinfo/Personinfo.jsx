import React, { useEffect, useState } from 'react';
import './Personinfo.css';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { getPerson } from '../../../io/http';

const Personinfo = withBehandlingContext(({ behandling }) => {
    const { aktorId } = behandling.originalSøknad;
    const [personinfo, setPersoninfo] = useState(behandling.personinfo);

    useEffect(() => {
        if (personinfo === undefined) {
            getPerson(aktorId)
                .then(response => {
                    response.data && setPersoninfo(response.data);
                })
                .catch(err => {
                    console.error('Feil ved henting av person.', err);
                    setPersoninfo({
                        navn: 'Navn ikke tilgjengelig',
                        kjønn: 'Ikke tilgjengelig'
                    });
                });
        }
    }, [behandling]);

    return (
        <>
            {personinfo && (
                <div className="personalia-linje">
                    <figure
                        id="personinfo-kjønn"
                        aria-label={`Kjønn: ${personinfo.kjønn}`}
                        className={personinfo.kjønn.toLowerCase()}
                    />
                    <Element>{personinfo.navn}</Element>
                    <Undertekst>Aktør-ID: {aktorId}</Undertekst>
                </div>
            )}
        </>
    );
});

export default Personinfo;
