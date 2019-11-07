import React, { useContext, useEffect, useMemo, useState } from 'react';
import Clipboard from '../Clipboard';
import { getPersoninfo } from '../../io/http';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import './PersonBar.less';

const formatFnr = fnr => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const finnSøknad = person =>
    person.arbeidsgivere[0].saker[0].sykdomstidslinje.hendelser.find(
        h => h.type === 'SendtSøknadMottatt'
    ).søknad;

const finnSykmeldingsgrad = person => finnSøknad(person).soknadsperioder[0].sykmeldingsgrad;

const PersonBar = () => {
    const { personTilBehandling } = useContext(PersonContext);
    const aktørId = personTilBehandling?.aktørId;
    const [personinfo, setPersoninfo] = useState(personinfo);

    useEffect(() => {
        if (aktørId) {
            getPersoninfo(aktørId)
                .then(response => setPersoninfo(response.data))
                .catch(err => {
                    console.error('Feil ved henting av person.', err);
                });
        }
    }, [aktørId]);

    const data = useMemo(() => {
        if (!personTilBehandling || !personinfo) {
            return null;
        }
        return {
            navn: personinfo.navn ?? 'Navn ikke tilgjengelig',
            fnr: personinfo.fnr,
            arbeidsgivernavn: finnSøknad(personTilBehandling)?.arbeidsgiver.navn,
            sykmeldingsgrad: `${finnSykmeldingsgrad(personTilBehandling)}%`,
            ariaLabelKjønn: `Kjønn: ${personinfo.kjønn ?? 'Ikke tilgjengelig'}`,
            classNameKjønn: personinfo.kjønn?.toLowerCase() ?? 'kjønnsnøytral'
        };
    }, [personTilBehandling, personinfo]);

    return (
        <div className="PersonBar">
            {data && (
                <>
                    <Normaltekst>{data.arbeidsgivernavn}</Normaltekst>
                    <Normaltekst>{' / '}</Normaltekst>
                    <Normaltekst>{data.sykmeldingsgrad}</Normaltekst>
                    <span className="PersonBar__separator" />
                    <figure
                        id="PersonBar__gender"
                        aria-label={data.ariaLabelKjønn}
                        className={data.classNameKjønn}
                    />
                    <Element>{data.navn}</Element>
                    <Normaltekst>/</Normaltekst>
                    {data.fnr ? (
                        <Clipboard>
                            <Normaltekst>{formatFnr(data.fnr)}</Normaltekst>
                        </Clipboard>
                    ) : (
                        <Normaltekst>Fødselsnummer ikke tilgjengelig</Normaltekst>
                    )}
                    <Normaltekst>/</Normaltekst>
                    <Normaltekst>Aktør-ID: {aktørId}</Normaltekst>
                </>
            )}
        </div>
    );
};

export default PersonBar;
