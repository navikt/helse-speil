import React from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';

const SykdomsvilkårInfotrygd = () => {
    return (
        <>
            <h2>Sykdomsvilkår</h2>
            <span className="Infotrygd__content">
                <InfotrygdList>
                    <InfotrygdListItem label="Sykdomdsvilkår må vurderes manuelt" status="!" />
                </InfotrygdList>
            </span>
        </>
    )
};

export default SykdomsvilkårInfotrygd;
