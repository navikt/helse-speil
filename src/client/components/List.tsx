import React from 'react';
import styled from '@emotion/styled';

interface Props {
    className?: string;
}

const StyledList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
`;

export const List: React.FC<Props> = ({ children, className }) => (
    <StyledList className={className}>{children}</StyledList>
);
