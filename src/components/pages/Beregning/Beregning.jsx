import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Panel } from 'nav-frontend-paneler';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';

const Beregning = () => {
    return (
        <Panel border>
            <Undertittel className="panel-tittel">
                Beregning av sykepengegrunnlag og dagsats
            </Undertittel>
            <Navigasjonsknapper previous="/inngangsvilkår" next="/periode" />
        </Panel>
    );
};

export default Beregning;
