import React, { useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { PersonContext } from '../../../context/PersonContext';

const InngangsvilkårInfotrygd = () => {
    const { inngangsvilkår } = useContext(PersonContext).personTilBehandling;

    const søknadsfristItems = []; // ItemMapper.søknadsfrist(inngangsvilkår.søknadsfrist);
    const dagerIgjenItems = []; // ItemMapper.dagerIgjen(inngangsvilkår.dagerIgjen);
    const under67ÅrItems = []; // ItemMapper.alder(inngangsvilkår.alder);

    return (
        <InfotrygdList>
            <InfotrygdListItem label="Dager igjen" status="OK" />
            {dagerIgjenItems.map(item => (
                <InfotrygdListItem label={item.label}>{item.value}</InfotrygdListItem>
            ))}
            <InfotrygdListItem />
            <InfotrygdListItem label="Under 67 år" status="OK" />
            {under67ÅrItems.map(item => (
                <InfotrygdListItem label={item.label}>{item.value}</InfotrygdListItem>
            ))}
            <InfotrygdListItem />
            <InfotrygdListItem label="Søknadsfrist" status="OK" />
            {søknadsfristItems.map(item => (
                <InfotrygdListItem label={item.label}>{item.value}</InfotrygdListItem>
            ))}
        </InfotrygdList>
    );
};

export default InngangsvilkårInfotrygd;
