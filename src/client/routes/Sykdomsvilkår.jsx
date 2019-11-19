import React from 'react';
import Subheader from '../components/Subheader';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';

const Sykdomsvilkår = () => {
    return (
        <Panel className="Sykdomsvilkår">
            <Subheader label="Sykdomsvilkår må vurderes manuelt" iconType="advarsel" />
            <Navigasjonsknapper previous={pages.SYKMELDINGSPERIODE} next={pages.INNGANGSVILKÅR} />
        </Panel>
    );
};

export default Sykdomsvilkår;
