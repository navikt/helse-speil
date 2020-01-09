import React, { useContext } from 'react';
import Row from '../components/Row/Row';
import ListItem from '../components/ListItem';
import Subheader from '../components/Subheader';
import ListSeparator from '../components/ListSeparator';
import SubheaderWithList from '../components/SubheaderWithList';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';
import { PersonContext } from '../context/PersonContext';
import { toKronerOgØre } from '../utils/locale';
import { Person } from '../context/types';
import { useTranslation } from 'react-i18next';

const G = 99858;

const Sykepengegrunnlag = () => {
    const { sykepengegrunnlag } = useContext(PersonContext).personTilBehandling as Person;
    const { t } = useTranslation();

    return (
        <Panel className="tekstbolker Sykepengegrunnlag">
            {sykepengegrunnlag && (
                <>
                    <SubheaderWithList label={t('sykepengegrunnlag.inntektsmeldinger')}>
                        <ListItem label={t('sykepengegrunnlag.månedsinntekt')}>
                            {`${toKronerOgØre(sykepengegrunnlag.månedsinntekt)} kr`}
                        </ListItem>
                        <ListItem label={t('sykepengegrunnlag.årsinntekt')}>
                            {`${toKronerOgØre(sykepengegrunnlag.årsinntekt)} kr`}
                        </ListItem>
                    </SubheaderWithList>
                    <Subheader label={t('sykepengegrunnlag.aordningen')} iconType="advarsel" />
                    <Subheader label={t('sykepengegrunnlag.avvik')} iconType="advarsel" />
                    <Row label={t('sykepengegrunnlag.sykepengegrunnlag')}>
                        {`${toKronerOgØre(sykepengegrunnlag.grunnlag)} kr`}
                    </Row>
                    <Row label={t('sykepengegrunnlag.redusert')}>
                        {(sykepengegrunnlag?.grunnlag ?? 0) > G * 6 ? `${toKronerOgØre(G * 6)} kr` : '-'}
                    </Row>
                    <ListSeparator />
                    <Row label={t('sykepengegrunnlag.dagsats')}>{`${toKronerOgØre(sykepengegrunnlag.dagsats)} kr`}</Row>
                </>
            )}
            <Navigasjonsknapper previous={pages.INNTEKTSKILDER} next={pages.UTBETALINGSOVERSIKT} />
        </Panel>
    );
};

export default Sykepengegrunnlag;
