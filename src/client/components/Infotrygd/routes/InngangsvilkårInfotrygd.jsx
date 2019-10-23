import React, { useContext } from 'react';
import ItemMapper from '../../../datamapping/inngangsvilkårMapper';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { BehandlingerContext } from '../../../context/BehandlingerContext';

const InngangsvilkårInfotrygd = () => {
    const { personTilBehandling } = useContext(BehandlingerContext);

    const søknadsfristItems = ItemMapper.søknadsfrist(
        personTilBehandling.inngangsvilkår.søknadsfrist
    );
    const medlemsskapsItems = ItemMapper.medlemskap(personTilBehandling.inngangsvilkår.medlemskap);
    const opptjeningsItems = ItemMapper.opptjening(personTilBehandling.inngangsvilkår.opptjening);
    const dagerIgjenItems = ItemMapper.dagerIgjen(personTilBehandling.inngangsvilkår.dagerIgjen);
    const merEnn05GItems = ItemMapper.merEnn05G(personTilBehandling.inngangsvilkår.merEnn05G);
    const under67ÅrItems = ItemMapper.under67År(personTilBehandling.inngangsvilkår.dagerIgjen);

    return (
        <>
            <h2>Inngangsvilkår</h2>
            <span className="Infotrygd__content">
                <span className="Infotrygd__content--left">
                    <InfotrygdList>
                        <InfotrygdListItem label="Inngangsvilkår er oppfylt" status="OK" />
                        {medlemsskapsItems.map(item => (
                            <InfotrygdListItem label={item.label}>{item.value}</InfotrygdListItem>
                        ))}
                        <InfotrygdListItem />
                        <InfotrygdListItem label="Opptjening" status="OK" />
                        {opptjeningsItems.map(item => (
                            <InfotrygdListItem label={item.label}>{item.value}</InfotrygdListItem>
                        ))}
                        <InfotrygdListItem />
                        <InfotrygdListItem label="Mer enn 0,5G" status="OK" />
                        {merEnn05GItems.map(item => (
                            <InfotrygdListItem label={item.label}>{item.value}</InfotrygdListItem>
                        ))}
                    </InfotrygdList>
                </span>
                <span className="Infotrygd__content--right">
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
                </span>
            </span>
        </>
    );
};

export default InngangsvilkårInfotrygd;
