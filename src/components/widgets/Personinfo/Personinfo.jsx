import React, { useEffect, useState } from 'react';
import './Personinfo.css';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import { toDate } from '../../../utils/date';
import { getPerson } from '../../../io/http';

const Kjønn = {
    MANN: 'mann',
    KVINNE: 'kvinne',
    NØYTRAL: 'kjønnsnøytral'
};

const Personinfo = withBehandlingContext(({ behandling }) => {
    const { aktorId, arbeidsgiver, fom, tom } = behandling.originalSøknad;
    const sykmeldingsgrad = behandling.periode.sykmeldingsgrad;
    const [person, setPerson] = useState({
        navn: 'Navn Navnesen',
        kjønn: Kjønn.NØYTRAL
    });

    useEffect(() => {
        getPerson(aktorId).then(response => {
            response.data && setPerson(response.data);
        });
    }, []);

    return (
        <>
            <div className="personalia-linje">
                <figure
                    id="personinfo-kjønn"
                    aria-label={`Kjønn: ${person.kjønn}`}
                    className={person.kjønn.toLowerCase()}
                />
                <Element>{person.navn}</Element>/
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
