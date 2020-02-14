import React from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';
import { useTranslation } from 'react-i18next';

const Oppfølging = () => {
    const { t } = useTranslation();

    return (
        <Panel className="Oppfølging">
            <Navigasjonsknapper previous={pages.SYKMELDINGSPERIODE} next={pages.INNGANGSVILKÅR} />
        </Panel>
    );
};

export default Oppfølging;
