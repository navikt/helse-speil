import React from 'react';
import NavigationButtons from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';

const Periode = () => {
    return (
        <Panel className="Periode">
            <Normaltekst>Ingen data</Normaltekst>
            <NavigationButtons previous="/beregning" next="/utbetaling" />
        </Panel>
    );
};

export default Periode;
