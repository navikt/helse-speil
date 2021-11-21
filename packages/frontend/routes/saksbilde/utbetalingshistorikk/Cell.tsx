import styled from '@emotion/styled';
import React from 'react';

const Container = styled.td`
    padding: 0.5rem 0.75rem;
`;

export const Cell: React.FC<React.HTMLAttributes<HTMLTableCellElement>> = (props) => <Container {...props} />;
