import React, { ReactChild, useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { capitalize, toKronerOgØre } from '../../../utils/locale';
import { PersonContext } from '../../../context/PersonContext';
import { Person } from '../../../context/types';
import { toDate } from '../../../utils/date';

const InngangsvilkårInfotrygd = () => {
    const { inngangsvilkår } = useContext(PersonContext).personTilBehandling as Person;

    return (
        <InfotrygdList>
            <InfotrygdListItem label="Medlemsskap må vurderes manuelt" status="!" />
            <InfotrygdListItem label="Opptjening må vurderes manuelt" status="!" />
            <InfotrygdListItem />
            <InfotrygdListItem label="Mer enn 0,5G" status="OK">
                {`${toKronerOgØre(inngangsvilkår.sykepengegrunnlag!)} kr`}
            </InfotrygdListItem>
            <InfotrygdListItem label={`0,5G er ${toKronerOgØre(99858 / 2)} kr`} />
            <InfotrygdListItem />
            <InfotrygdListItem label="Dager igjen" status="OK" />
            <InfotrygdListItem label="Første fraværsdag">
                {toDate(inngangsvilkår.dagerIgjen.førsteFraværsdag)}
            </InfotrygdListItem>
            <InfotrygdListItem label="Første sykepengedag">
                {toDate(inngangsvilkår.dagerIgjen.førsteSykepengedag!)}
            </InfotrygdListItem>
            <InfotrygdListItem label="Yrkesstatus">
                {capitalize(inngangsvilkår.dagerIgjen.yrkesstatus!)}
            </InfotrygdListItem>
            <InfotrygdListItem label="Dager brukt">
                {inngangsvilkår.dagerIgjen.dagerBrukt}
            </InfotrygdListItem>
            <InfotrygdListItem label="Dager igjen">
                {248 - inngangsvilkår.dagerIgjen.dagerBrukt}
            </InfotrygdListItem>
            <InfotrygdListItem label="Maks dato">
                {toDate(inngangsvilkår.dagerIgjen.maksdato)}
            </InfotrygdListItem>
            <InfotrygdListItem />
            <InfotrygdListItem label="Under 67 år" status="OK" />
            <InfotrygdListItem label="Alder">
                {inngangsvilkår.alder as ReactChild}
            </InfotrygdListItem>
            <InfotrygdListItem label="Søknadsfrist" status="OK" />
            <InfotrygdListItem label="Sendt Nav">
                {toDate(inngangsvilkår.søknadsfrist.sendtNav!)}
            </InfotrygdListItem>
            <InfotrygdListItem label="Søknad t.o.m.">
                {toDate(inngangsvilkår.søknadsfrist.søknadTom!)}
            </InfotrygdListItem>
            <InfotrygdListItem label="Innen 3 mnd">
                {inngangsvilkår.søknadsfrist.innen3Mnd ? 'Ja' : 'Nei'}
            </InfotrygdListItem>
        </InfotrygdList>
    );
};

export default InngangsvilkårInfotrygd;
