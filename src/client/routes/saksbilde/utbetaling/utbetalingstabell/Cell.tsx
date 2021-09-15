import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Cell = styled.td<{ erOverstyrt?: boolean }>`
    ${(props) =>
        props.erOverstyrt &&
        css`
            &,
            * {
                font-style: italic;
            }
        `}
`;
