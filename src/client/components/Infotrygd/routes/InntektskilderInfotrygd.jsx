import React, { useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { item } from '../../../datamapping/mappingUtils';
import { PersonContext } from '../../../context/PersonContext';
import { toLocaleFixedNumberString } from '../../../utils/locale';

const InntektskilderInfotrygd = () => {
    const { inntektskilder } = useContext(PersonContext).personTilBehandling;
    const inntektsmeldingItems = inntektskilder && [
        item(
            'Beregnet månedsinntekt',
            `${toLocaleFixedNumberString(inntektskilder.månedsinntekt, 2)} kr`
        ),
        item(
            'Omregnet årsinntekt',
            `${toLocaleFixedNumberString(inntektskilder.årsinntekt, 2)} kr`
        ),
        item('Refusjon til arbeidsgiver', inntektskilder.refusjon),
        item('Betaler arbeidsgiverperiode', inntektskilder.forskuttering)
    ];

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
            <InfotrygdListItem />
            <InfotrygdListItem label="Refusjon til arbeidsgiver">
                {inntektskilder.refusjon}
            </InfotrygdListItem>
            <InfotrygdListItem label="Betaler arbeidsgiverperiode">
                {inntektskilder.forskuttering}
            </InfotrygdListItem>
        </InfotrygdList>
    );
};

export default InntektskilderInfotrygd;
