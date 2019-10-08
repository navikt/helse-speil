import React, { useContext, useEffect } from 'react';
import Clipboard from '../Clipboard';
import { getPerson } from '../../io/http';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { BehandlingerContext, withBehandlingContext } from '../../context/BehandlingerContext';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import './PersonBar.less';

const formatFnr = fnr => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const PersonBar = withBehandlingContext(({ behandling }) => {
    const { valgtBehandling } = useContext(BehandlingerContext);
    const { aktorId } = valgtBehandling.originalSøknad;
    const [personinfo, setPersoninfo] = useSessionStorage(
        `personinfo-${valgtBehandling?.behandlingsId}`,
        valgtBehandling.personinfo
    );

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
                    {personinfo.fnr ? (
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
});

export default PersonBar;
