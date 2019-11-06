import React from 'react';
import NavigationButtons from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { fordelingtekster } from '../../tekster';

const Periode = () => {
    return (
        <Panel className="Periode">
            <Undertittel className="panel-tittel">{fordelingtekster('tittel')}</Undertittel>
            <Normaltekst>Ingen data</Normaltekst>
            <NavigationButtons previous="/beregning" next="/utbetaling" />
        </Panel>
    );
};

export default Periode;
