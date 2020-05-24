import React, { ChangeEvent, useContext } from 'react';
import { Select } from '../Select';
import dayjs from 'dayjs';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { useIntervaller } from './useIntervaller';
import { EnkelSykepengetidslinje } from '@navikt/helse-frontend-tidslinje/dist/components/sykepengetidslinje/Sykepengetidslinje';
import { PersonContext } from '../../context/PersonContext';

const SelectContainer = styled.div`
    padding-top: 12px;
    height: 44px;
    width: 250px;
`;

interface PeriodevelgerProps {
    tidslinjerader: EnkelSykepengetidslinje[];
}

const Periodevelger = ({ tidslinjerader }: PeriodevelgerProps) => {
    const { aktivVedtaksperiode, aktiverVedtaksperiode } = useContext(PersonContext);

    const intervaller = useIntervaller(tidslinjerader, aktivVedtaksperiode);
    const aktivtIntervall = intervaller.find(intervall => intervall.active);

    const onChange = (event: ChangeEvent<HTMLOptionElement>) => {
        const intervallet = intervaller.find(i => i.id === event.target.value)!;
        const nyPeriode = tidslinjerader
            .flatMap(rad => rad.perioder)
            .find(
                periode =>
                    periode.fom.getTime() === intervallet.fom.getTime() &&
                    periode.tom.getTime() === intervallet.tom.getTime()
            );
        aktiverVedtaksperiode(nyPeriode!.id);
    };

    return (
        <SelectContainer>
            <Select name="tidslinjeintervaller" onChange={onChange} value={aktivtIntervall?.id}>
                {intervaller.map(intervallet => (
                    <option key={intervallet.id} value={intervallet.id}>
                        {`${dayjs(intervallet.fom).format(NORSK_DATOFORMAT)} - ${dayjs(intervallet.tom).format(
                            NORSK_DATOFORMAT
                        )}`}
                    </option>
                ))}
            </Select>
        </SelectContainer>
    );
};

export default Periodevelger;
