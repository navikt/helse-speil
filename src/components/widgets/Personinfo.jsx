import React from 'react';
import './Personinfo.css';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { withBehandlingContext } from '../../context/withBehandlingContext';
import { toDate } from '../../utils/date';

const Personinfo = withBehandlingContext(({ behandling }) => {
    const { aktorId, arbeidsgiver, fom, tom } = behandling.originalSøknad;
    const sykmeldingsgrad =
        behandling.originalSøknad.soknadsperioder[0].sykmeldingsgrad;

    const søkernavn = 'Navn Navnesen';
    const telefonnummer = '123-99-124';

    return (
        <>
            <div className="personalia-linje">
                <Element>{søkernavn}</Element>&nbsp;
                <Undertekst>
                    / Aktør-ID: {aktorId} / Tlf: {telefonnummer}
                </Undertekst>
            </div>
            <hr />
            <div className="behandling-hovedinfo">
                <Undertekst className="arbeidsgivernavn">
                    {arbeidsgiver.navn}
                </Undertekst>
                <Element className="sykdomsperiode">
                    {toDate(fom)} - {toDate(tom)}
                </Element>
                <Element className="sykmeldingsgrad">
                    Førstegangsb. / {sykmeldingsgrad}%
                </Element>
            </div>
        </>
    );
});

export default Personinfo;
