import styled from '@emotion/styled';
import React from 'react';

import { Checkbox as NavCheckbox } from '@navikt/ds-react';

const Checkbox = styled(NavCheckbox)`
    padding: 0;
    > input {
        max-height: 2rem;
        max-width: 2rem;
    }
`;

interface VelgRadCellProps {
    index: number;
    onChange: (checked: boolean) => void;
}

export const VelgRadCell: React.FC<VelgRadCellProps> = ({ index, onChange }) => {
    return (
        <td>
            <Checkbox onChange={(event) => onChange(event.target.checked)} hideLabel>
                Velg rad {index + 1} for endring
            </Checkbox>
        </td>
    );
};
