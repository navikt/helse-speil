import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

export const CellContent = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    white-space: nowrap;
`;

export const InteractiveCellContent = ({ children }: { children: ReactNode }) => (
    <CellContent onClick={(e) => e.stopPropagation()} onKeyPress={(e) => e.stopPropagation()}>
        {children}
    </CellContent>
);
