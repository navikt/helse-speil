import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';

const Periode = () => {
    return (
        <Panel border>
            <Undertittel className="panel-tittel">
                Beregning av sykepengeperiode
            </Undertittel>
            <Navigasjonsknapper previous="/beregning" next="/utbetaling" />
        </Panel>
    );
};

export default Periode;
