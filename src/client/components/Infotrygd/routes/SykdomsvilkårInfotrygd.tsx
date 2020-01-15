import React from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { useTranslation } from 'react-i18next';

const SykdomsvilkårInfotrygd = () => {
    const { t } = useTranslation();
    return (
        <InfotrygdList>
            <InfotrygdListItem label={t('sykdomsvilkår.sykdomsvilkår')} status="!" />
        </InfotrygdList>
    );
};

export default SykdomsvilkårInfotrygd;
