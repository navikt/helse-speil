import React from 'react';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';

const Sykdomsvilkår = () => {
    return (
        <Panel className="Sykdomsvilkår">
            <Normaltekst>Ingen data</Normaltekst>
            <Navigasjonsknapper previous="/sykmeldingsperiode" next="/inngangsvilkår" />
        </Panel>
    );
};

export default Sykdomsvilkår;
