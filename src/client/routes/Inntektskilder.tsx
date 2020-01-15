import React, { useContext } from 'react';
import Row from '../components/Row';
import ListItem from '../components/ListItem';
import Subheader from '../components/Subheader';
import SubheaderWithList from '../components/SubheaderWithList';
import NavigationButtons from '../components/NavigationButtons/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';
import { PersonContext } from '../context/PersonContext';
import { toKronerOgØre } from '../utils/locale';
import { Person } from '../context/types';
import { useTranslation } from 'react-i18next';

const Inntektskilder = () => {
    const { inntektskilder } = useContext(PersonContext).personTilBehandling as Person;
    const { t } = useTranslation();

    return (
        <Panel className="tekstbolker">
            {inntektskilder && (
                <SubheaderWithList label={t('inntektskilder.inntektsmeldinger')}>
                    <ListItem label={t('inntektskilder.månedsinntekt')}>
                        {`${toKronerOgØre(inntektskilder.månedsinntekt!)} kr`}
                    </ListItem>
                    <ListItem label={t('inntektskilder.årsinntekt')}>
                        {`${toKronerOgØre(inntektskilder.årsinntekt!)} kr`}
                    </ListItem>
                </SubheaderWithList>
            )}
            <Subheader label={t('inntektskilder.aordningen')} iconType="advarsel" />
            <Row label={t('inntektskilder.refusjon')}>{inntektskilder.refusjon}</Row>
            <Row label={t('inntektskilder.arbeidsgiverperiode')}>
                {inntektskilder.forskuttering}
            </Row>
            <NavigationButtons previous={pages.INNGANGSVILKÅR} next={pages.SYKEPENGEGRUNNLAG} />
        </Panel>
    );
};

export default Inntektskilder;
