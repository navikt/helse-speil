import React, { useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { PersonContext } from '../../../context/PersonContext';
import { useTranslation } from 'react-i18next';
import { toKronerOgØre } from '../../../utils/locale';

const InntektskilderInfotrygd = () => {
    const { inntektskilder } = useContext(PersonContext).personTilBehandling!;
    const { t } = useTranslation();

    return (
        <InfotrygdList>
            <InfotrygdListItem label={t('inntektskilder.inntektsmeldinger')} status="OK" />
            <InfotrygdListItem label={t('inntektskilder.månedsinntekt')}>
                {`${toKronerOgØre(inntektskilder.månedsinntekt!)} kr`}
            </InfotrygdListItem>
            <InfotrygdListItem label={t('inntektskilder.årsinntekt')}>
                {`${toKronerOgØre(inntektskilder.årsinntekt!)} kr`}
            </InfotrygdListItem>
            <InfotrygdListItem />
            <InfotrygdListItem label={t('inntektskilder.aordningen')} status="!" />
            <InfotrygdListItem />
            <InfotrygdListItem label={t('inntektskilder.refusjon')}>
                {inntektskilder.refusjon}
            </InfotrygdListItem>
            <InfotrygdListItem label={t('inntektskilder.arbeidsgiverperiode')}>
                {inntektskilder.forskuttering}
            </InfotrygdListItem>
        </InfotrygdList>
    );
};

export default InntektskilderInfotrygd;
