import React from 'react';
import './Personinfo.css';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { toDate } from '../../../utils/date';

const Kjønn = {
    MANN: 'mann',
    KVINNE: 'kvinne',
    NØYTRAL: 'kjønnsnøytral'
};

const Personinfo = withBehandlingContext(({ behandling }) => {
    const { aktorId, arbeidsgiver, fom, tom } = behandling.originalSøknad;
    const sykmeldingsgrad = behandling.periode.sykmeldingsgrad;

    const søkernavn = 'Navn Navnesen';
    const kjønn = Kjønn.NØYTRAL;

    return (
        <>
            <div className="personalia-linje">
                <figure
                    id="personinfo-kjønn"
                    aria-label={`Kjønn: ${kjønn}`}
                    className={kjønn}
                />
                <Element>{søkernavn}</Element>/
                <Undertekst>Aktør-ID: {aktorId}</Undertekst>
            </div>
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
