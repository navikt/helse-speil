import React, { useContext, useEffect, useState } from 'react';
import Clipboard from '../Clipboard';
import CasePicker from '../CasePicker';
import { getPerson } from '../../io/http';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import './PersonBar.less';

const formatFnr = fnr => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const PersonBar = () => {
    const { valgtBehandling } = useContext(BehandlingerContext);
    const aktorId = valgtBehandling?.originalSøknad?.aktorId;
    const [personinfo, setPersoninfo] = useState(valgtBehandling?.personinfo);

    useEffect(() => {
        if (aktorId) {
            getPerson(aktorId)
                .then(response => setPersoninfo(response.data))
                .catch(err => {
                    console.error('Feil ved henting av person.', err);
                });
        }
    }, [aktorId]);

    return (
        <div className="PersonBar">
            <CasePicker />
            {personinfo && valgtBehandling && (
                <>
                    <Normaltekst>{valgtBehandling.originalSøknad.arbeidsgiver.navn}</Normaltekst>
                    <Normaltekst>{' / '}</Normaltekst>
                    <Normaltekst>{`${valgtBehandling.periode.sykmeldingsgrad}%`}</Normaltekst>
                    <span className="PersonBar__separator" />
                    <figure
                        id="PersonBar__gender"
                        aria-label={`Kjønn: ${personinfo?.kjønn ?? 'Ikke tilgjengelig'}`}
                        className={personinfo?.kjønn?.toLowerCase() ?? 'kjønnsnøytral'}
                    />
                    <Element>{personinfo?.navn ?? 'Navn ikke tilgjengelig'}</Element>
                    <Normaltekst>/</Normaltekst>
                    {personinfo?.fnr ? (
                        <Clipboard>
                            <Normaltekst>{formatFnr(personinfo.fnr)}</Normaltekst>
                        </Clipboard>
                    ) : (
                        <Normaltekst>Fødselsnummer ikke tilgjengelig</Normaltekst>
                    )}
                    <Normaltekst>/</Normaltekst>
                    <Normaltekst>Aktør-ID: {aktorId}</Normaltekst>
                </>
            )}
        </div>
    );
};

export default PersonBar;
