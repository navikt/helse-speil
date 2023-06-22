import styled from '@emotion/styled';

interface GridProps {
    kolonner?: number;
    gridTemplateColumns?: string;
}

export const Grid = styled.div<GridProps>`
    display: grid;
    grid-template-columns: ${({ kolonner, gridTemplateColumns }) => {
        if (kolonner) {
            return `repeat(${kolonner}, auto)`;
        } else if (gridTemplateColumns) {
            return `${gridTemplateColumns ?? 'none'}`;
        } else {
            return 'repeat(1, auto)';
        }
    }};
`;
