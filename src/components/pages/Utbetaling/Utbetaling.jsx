import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';

const Utbetaling = () => {
    return (
        <Panel border>
            <Undertittel className="panel-tittel">
                Beregning av utbetaling
            </Undertittel>
            <Navigasjonsknapper previous="/periode" />
        </Panel>
    );
};

export default Utbetaling;
