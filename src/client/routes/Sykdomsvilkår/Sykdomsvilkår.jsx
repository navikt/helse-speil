import React from 'react';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { sykdomsvilkårtekster } from '../../tekster';

const Sykdomsvilkår = () => {
    return (
        <Panel className="Sykdomsvilkår">
            <Undertittel className="panel-tittel">{sykdomsvilkårtekster('tittel')}</Undertittel>
            <Normaltekst>Ingen data</Normaltekst>
            <Navigasjonsknapper previous="/sykmeldingsperiode" next="/inngangsvilkår" />
        </Panel>
    );
};

export default Sykdomsvilkår;
