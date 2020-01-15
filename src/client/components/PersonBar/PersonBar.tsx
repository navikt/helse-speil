import React, { useContext } from 'react';
import Clipboard from '../Clipboard';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import './PersonBar.less';
import { finnSykmeldingsgrad, finnSøknad } from '../../context/mapper';

const formatFnr = (fnr: string) => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const PersonBar = () => {
    const { personTilBehandling } = useContext(PersonContext);

    if (!personTilBehandling) return <div className="PersonBar" />;

    const { aktørId } = personTilBehandling;
    const personinfo = personTilBehandling.personinfo;
    const arbeidsgiver = finnSøknad(personTilBehandling)?.arbeidsgiver;
    const sykmeldingsgrad = finnSykmeldingsgrad(personTilBehandling) ?? '--';

    return (
        <div className="PersonBar">
            <Normaltekst>{arbeidsgiver?.navn || arbeidsgiver?.orgnummer}</Normaltekst>
            <Normaltekst>{' / '}</Normaltekst>
            <Normaltekst>{sykmeldingsgrad}%</Normaltekst>
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
            <Normaltekst>Aktør-ID: {aktørId}</Normaltekst>
        </div>
    );
};

export default PersonBar;
