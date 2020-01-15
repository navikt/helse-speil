import React, { useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { PersonContext } from '../../../context/PersonContext';
import { Person } from '../../../context/types';
import { useTranslation } from 'react-i18next';
import { toKronerOgØre } from '../../../utils/locale';

const G = 99858;

const SykepengegrunnlagInfotrygd = () => {
    const { t } = useTranslation();
    const { sykepengegrunnlag } = useContext(PersonContext).personTilBehandling as Person;

    return (
        <InfotrygdList>
            <InfotrygdListItem label={t('sykepengegrunnlag.inntektsmeldinger')} status="OK" />
            <InfotrygdListItem label={t('sykepengegrunnlag.månedsinntekt')}>
                {`${toKronerOgØre(sykepengegrunnlag.månedsinntekt!)} kr`}
            </InfotrygdListItem>
            <InfotrygdListItem label={t('sykepengegrunnlag.årsinntekt')}>
                {`${toKronerOgØre(sykepengegrunnlag.årsinntekt!)} kr`}
            </InfotrygdListItem>
            <InfotrygdListItem />
            <InfotrygdListItem />
            <InfotrygdListItem label={t('sykepengegrunnlag.aordningen')} status="!" />
            <InfotrygdListItem label={t('sykepengegrunnlag.avvik')} status="!" />
            <InfotrygdListItem />
            <InfotrygdListItem label={t('sykepengegrunnlag.sykepengegrunnlag')}>
                {`${toKronerOgØre(sykepengegrunnlag.grunnlag!)} kr`}
            </InfotrygdListItem>
            <InfotrygdListItem label={t('sykepengegrunnlag.redusert')}>
                {(sykepengegrunnlag?.grunnlag ?? 0) > G * 6
                    ? `${toKronerOgØre(G * 6)} kr`
                    : '-'}
            </InfotrygdListItem>
            <InfotrygdListItem />
            <InfotrygdListItem label={t('sykepengegrunnlag.dagsats')}>
                {`${toKronerOgØre(sykepengegrunnlag.dagsats!)} kr`}
            </InfotrygdListItem>
        </InfotrygdList>
    );
};

export default SykepengegrunnlagInfotrygd;
