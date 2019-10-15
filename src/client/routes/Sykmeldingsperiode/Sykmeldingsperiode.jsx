import React from 'react';
import Timeline from '../../components/Timeline';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';

const Sykmeldingsperiode = () => {
    return (
        <Panel className="Sykmeldingsperiode" border>
            <Undertittel className="panel-tittel">Sykmeldingsperiode</Undertittel>
            <Timeline />
            <Navigasjonsknapper next="/sykdomsvilkår" />
        </Panel>
    );
};

export default Sykmeldingsperiode;
