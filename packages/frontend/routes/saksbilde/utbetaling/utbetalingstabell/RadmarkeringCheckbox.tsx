import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React from 'react';

import { Checkbox } from '@navikt/ds-react';

import { DisabledCheckbox } from './DisabledCheckbox';

import { overstyrPermisjonsdagerEnabled } from '@utils/featureToggles';

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
    dagtype: Dag['type'];
    dato: Dayjs;
    skjæringstidspunkt: string;
}

export const RadmarkeringCheckbox: React.FC<RadmarkeringCheckboxProps> = ({
    index,
    dagtype,
    dato,
    skjæringstidspunkt,
    ...rest
}) => {
    const erSkjæringstidspunkt: boolean = skjæringstidspunkt !== undefined && dato.isSame(skjæringstidspunkt, 'day');

    const dagKanOverstyres =
        (dagtype !== 'Helg' && ['Syk', 'Ferie', 'Egenmelding'].includes(dagtype)) ||
        (overstyrPermisjonsdagerEnabled && dagtype === 'Permisjon');

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
