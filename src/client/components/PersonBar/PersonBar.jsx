import React, { useContext } from 'react';
import Clipboard from '../Clipboard';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import './PersonBar.less';

const formatFnr = fnr => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const finnSøknad = person =>
    person.arbeidsgivere[0].saker[0].sykdomstidslinje.hendelser.find(
        h => h.type === 'SendtSøknadMottatt'
    ).søknad;

const finnSykmeldingsgrad = person => finnSøknad(person).soknadsperioder[0].sykmeldingsgrad;

const render = content => <div className="PersonBar">{content}</div>;

const PersonBar = () => {
    const { personTilBehandling } = useContext(PersonContext);

    if (!personTilBehandling) return render(null);

    const { aktørId } = personTilBehandling;
    const personinfo = personTilBehandling.personinfo ?? {};
    const arbeidsgiver = finnSøknad(personTilBehandling)?.arbeidsgiver ?? {};

    const data = {
        navn: personinfo.navn ?? 'Navn ikke tilgjengelig',
        fnr: personinfo.fnr,
        arbeidsgivernavn: arbeidsgiver.navn || arbeidsgiver.orgnummer,
        sykmeldingsgrad: `${finnSykmeldingsgrad(personTilBehandling)}%`,
        ariaLabelKjønn: `Kjønn: ${personinfo.kjønn ?? 'Ikke tilgjengelig'}`,
        classNameKjønn: personinfo.kjønn?.toLowerCase() ?? 'kjønnsnøytral'
    };

    return render(
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
    );
};

export default PersonBar;
