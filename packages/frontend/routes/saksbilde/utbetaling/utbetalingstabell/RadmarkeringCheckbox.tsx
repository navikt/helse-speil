import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { Checkbox } from '@navikt/ds-react';

import { erDev, erLocal } from '@utils/featureToggles';

import { DisabledCheckbox } from './DisabledCheckbox';

const Container = styled.div`
    position: relative;
    padding: 1rem;

    > div {
        position: absolute;
        padding: 0;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        > input {
            max-height: 2rem;
            max-width: 2rem;
        }
    }
`;

interface RadmarkeringCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value'> {
    index: number;
    dagtype: Utbetalingstabelldagtype;
    dato: DateString;
    erAGP?: boolean;
    erAvvist?: boolean;
    erForeldet?: boolean;
    skjæringstidspunkt: DateString;
}

export const RadmarkeringCheckbox: React.FC<RadmarkeringCheckboxProps> = ({
    index,
    dagtype,
    dato,
    erAGP,
    erAvvist,
    erForeldet,
    skjæringstidspunkt,
    ...rest
}) => {
    const erSkjæringstidspunkt: boolean = dayjs(dato).isSame(skjæringstidspunkt, 'day');

    const dagKanOverstyres =
        (!erAGP &&
            !erAvvist &&
            !erForeldet &&
            !['Helg'].includes(dagtype) &&
            ['Syk', 'Ferie', 'Egenmelding'].includes(dagtype)) ||
        ((erDev() || erLocal()) && ['Permisjon', 'Arbeid'].includes(dagtype));

    if (!dagKanOverstyres) {
        return <Container />;
    }

    if (erSkjæringstidspunkt) {
        return <DisabledCheckbox label="Kan foreløpig ikke endres. Mangler støtte for skjæringstidspunkt" />;
    }

    return (
        <Container>
            <Checkbox {...rest} hideLabel>
                Velg rad {index + 1} for endring
            </Checkbox>
        </Container>
    );
};
