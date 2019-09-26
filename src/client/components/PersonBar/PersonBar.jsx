import React, { useEffect, useState } from 'react';
import Clipboard from '../Clipboard';
import { getPerson } from '../../io/http';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { withBehandlingContext } from '../../context/BehandlingerContext';
import './PersonBar.less';

const formatFnr = fnr => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const PersonBar = withBehandlingContext(({ behandling, fnr }) => {
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
                <div className="PersonBar">
                    <figure
                        id="PersonBar__gender"
                        aria-label={`Kjønn: ${personinfo.kjønn}`}
                        className={personinfo.kjønn.toLowerCase()}
                    />
                    <Element>{personinfo.navn}</Element>
                    <Undertekst>/</Undertekst>
                    {fnr ? (
                        <Clipboard>
                            <Undertekst>{formatFnr(fnr)}</Undertekst>
                        </Clipboard>
                    ) : (
                        <Undertekst>Fødselsnummer ikke tilgjengelig</Undertekst>
                    )}
                    <Undertekst>/</Undertekst>
                    <Undertekst>Aktør-ID: {aktorId}</Undertekst>
                </div>
            )}
        </>
    );
});

export default PersonBar;
