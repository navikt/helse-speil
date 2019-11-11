import React from 'react';
import IconRow from '../../components/Rows/IconRow';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import './Sykdomsvilkår.less';

const Sykdomsvilkår = () => {
    return (
        <Panel className="Sykdomsvilkår">
            <IconRow label="Sykdomsvilkår må vurderes manuelt" iconType="advarsel" />
            <Navigasjonsknapper previous={pages.SYKMELDINGSPERIODE} next={pages.INNGANGSVILKÅR} />
        </Panel>
    );
};

export default Sykdomsvilkår;
