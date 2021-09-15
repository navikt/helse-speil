import styled from '@emotion/styled';
import { Dagtype } from 'internal-types';
import React from 'react';

import { Checkbox } from '@navikt/ds-react';

import { overstyrPermisjonsdagerEnabled } from '../../../../featureToggles';

const Container = styled.div`
    position: relative;
    padding: 1rem;
    background: #fff;

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
    dagtype: Dagtype;
}

export const RadmarkeringCheckbox: React.FC<RadmarkeringCheckboxProps> = ({ index, dagtype, ...rest }) => {
    const dagKanOverstyres =
        (dagtype !== Dagtype.Helg && [Dagtype.Syk, Dagtype.Ferie, Dagtype.Egenmelding].includes(dagtype)) ||
        (overstyrPermisjonsdagerEnabled && dagtype === Dagtype.Permisjon);

    if (!dagKanOverstyres) {
        return <Container />;
    }

    return (
        <Container>
            <Checkbox {...rest} hideLabel>
                Velg rad {index + 1} for endring
            </Checkbox>
        </Container>
    );
};
