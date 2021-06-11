import styled from '@emotion/styled';
import { Dagtype } from 'internal-types';
import React from 'react';

import { CellContent } from '../../table/CellContent';
import { DagtypeIcon } from './DagtypeIcon';

const IconContainer = styled.div`
    width: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

interface DagtypeCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    type: Dagtype;
}

export const DagtypeCell = ({ type, ...rest }: DagtypeCellProps) => (
    <td {...rest}>
        <CellContent>
            <IconContainer>
                <DagtypeIcon type={type} />
            </IconContainer>
            {type}
        </CellContent>
    </td>
);
