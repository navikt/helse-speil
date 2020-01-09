import React from 'react';
import Subheader from '../components/Subheader';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';
import { useTranslation } from 'react-i18next';

const Sykdomsvilkår = () => {
    const { t } = useTranslation();

    return (
        <Panel className="Sykdomsvilkår">
            <Subheader label={t('sykdomsvilkår.sykdomsvilkår')} iconType="advarsel" />
            <Navigasjonsknapper previous={pages.SYKMELDINGSPERIODE} next={pages.INNGANGSVILKÅR} />
        </Panel>
    );
};

export default Sykdomsvilkår;
