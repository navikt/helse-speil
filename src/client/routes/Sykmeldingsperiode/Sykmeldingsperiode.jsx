import React from 'react';
import IconRow from '../../components/Rows/IconRow';
import Timeline from '../../components/Timeline';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { sykmeldingsperiodetekster } from '../../tekster';
import './Sykmeldingsperiode.less';

const Sykmeldingsperiode = () => {
    return (
        <Panel className="Sykmeldingsperiode">
            <Undertittel className="panel-tittel">Kun demo</Undertittel>
            <IconRow label={sykmeldingsperiodetekster('dager')} bold />
            <Timeline />
            <Navigasjonsknapper next="/sykdomsvilkår" />
        </Panel>
    );
};

export default Sykmeldingsperiode;
