import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

interface GridProps {
    children: ReactNode | ReactNode[];
    className?: string;
    kolonner?: number;
}

interface GridContainerProps {
    kolonner: number;
}

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(${(props: GridContainerProps) => props.kolonner}, auto);
`;

const Grid = ({ children, className = 'Grid', kolonner = 1 }: GridProps) => {
    return (
        <GridContainer kolonner={kolonner} className={className}>
            {children}
        </GridContainer>
    );
};

export default Grid;
