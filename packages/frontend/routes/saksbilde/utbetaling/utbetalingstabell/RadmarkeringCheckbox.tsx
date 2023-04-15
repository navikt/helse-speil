import styled from '@emotion/styled';
import React from 'react';

import { Checkbox } from '@navikt/ds-react';

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
    erForeldet?: boolean;
}

export const RadmarkeringCheckbox: React.FC<RadmarkeringCheckboxProps> = ({ index, erForeldet, ...rest }) => {
    const dagKanOverstyres: Boolean = !erForeldet;

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
