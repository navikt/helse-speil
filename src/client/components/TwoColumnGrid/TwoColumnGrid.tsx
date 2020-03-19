import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

interface TwoColumnGridProps {
    children: ReactNode | ReactNode[];
    className?: string;
    firstColumnWidth?: string;
}

interface TwoColumnGridContainerProps {
    firstColumnWidth: string;
}

const TwoColumnGridContainer = styled.div`
    display: grid;
    grid-template-columns: ${(props: TwoColumnGridContainerProps) => props.firstColumnWidth} auto;
`;

const TwoColumnGrid = ({ children, className = 'Grid', firstColumnWidth = '37rem' }: TwoColumnGridProps) => {
    return (
        <TwoColumnGridContainer className={className} firstColumnWidth={firstColumnWidth}>
            {children}
        </TwoColumnGridContainer>
    );
};

export default TwoColumnGrid;
