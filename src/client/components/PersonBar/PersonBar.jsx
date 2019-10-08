import React, { useContext, useEffect, useState } from 'react';
import Clipboard from '../Clipboard';
import { getPerson } from '../../io/http';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import './PersonBar.less';

const formatFnr = fnr => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const PersonBar = () => {
    const { valgtBehandling } = useContext(BehandlingerContext);
    const { aktorId } = valgtBehandling.originalSøknad;
    const [personinfo, setPersoninfo] = useState(valgtBehandling.personinfo);

    useEffect(() => {
        getPerson(aktorId)
            .then(response => setPersoninfo(response.data))
            .catch(err => {
                console.error('Feil ved henting av person.', err);
            });
    }, [aktorId]);

    return (
        <>
            {personinfo && (
                <div className="PersonBar">
                    <figure
                        id="PersonBar__gender"
                        aria-label={`Kjønn: ${personinfo?.kjønn ?? 'Ikke tilgjengelig'}`}
                        className={personinfo?.kjønn?.toLowerCase() ?? 'kjønnsnøytral'}
                    />
                    <Element>{personinfo?.navn ?? 'Navn ikke tilgjengelig'}</Element>
                    <Undertekst>/</Undertekst>
                    {personinfo?.fnr ? (
                        <Clipboard>
                            <Undertekst>{formatFnr(personinfo.fnr)}</Undertekst>
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
};

export default PersonBar;
