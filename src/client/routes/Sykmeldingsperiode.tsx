import React, { useContext } from 'react';
import Timeline from '../components/Timeline';
import Subheader from '../components/Subheader';
import Navigasjonsknapper from '../components/NavigationButtons';
import { pages } from '../hooks/useLinks';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { useTranslation } from 'react-i18next';

const Sykmeldingsperiode = () => {
    const { personTilBehandling: person } = useContext(PersonContext);
    const { t } = useTranslation();

    return (
        <Panel className="Sykmeldingsperiode">
            {person?.arbeidsgivere ? (
                <>
                    <Subheader label={t('sykmeldingsperiode.dager')} iconType="ok" />
                    <Timeline person={person} showDagsats={false} />
                </>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}
            <Navigasjonsknapper next={pages.SYKDOMSVILKÅR} />
        </Panel>
    );
};

export default Sykmeldingsperiode;
