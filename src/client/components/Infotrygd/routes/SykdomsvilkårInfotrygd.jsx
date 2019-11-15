import React from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';

const SykdomsvilkårInfotrygd = () => {
    return (
        <InfotrygdList>
            <InfotrygdListItem label="Sykdomdsvilkår må vurderes manuelt" status="!" />
        </InfotrygdList>
    )
};

export default SykdomsvilkårInfotrygd;
