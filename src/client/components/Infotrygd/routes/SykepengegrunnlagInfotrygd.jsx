import React from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';

const SykepengegrunnlagInfotrygd = () => {
    const inntektsmeldingItems = [];

    return (
        <InfotrygdList>
            <InfotrygdListItem label="Hentet fra inntektsmeldingen" status="OK" />
            {inntektsmeldingItems.map(item => (
                <InfotrygdListItem key={item.label} label={item.label}>
                    {item.value}
                </InfotrygdListItem>
            ))}
            <InfotrygdListItem />
            <InfotrygdListItem label="A-ordningen må sjekkes manuelt" status="!" />
        </InfotrygdList>
    );
};

export default SykepengegrunnlagInfotrygd;
