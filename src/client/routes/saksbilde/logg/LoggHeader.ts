import styled from '@emotion/styled';

export const LoggHeader = styled.div`
    width: 258px;
    box-shadow: inset 0 -1px 0 0 var(--navds-color-border);
    height: 48px;
    box-sizing: border-box;

    & > button {
        height: 48px;
        min-height: 48px;
        box-sizing: border-box;
        width: 3rem;

        > svg {
            flex-shrink: 0;
            width: 18px;
            height: 18px;
        }

        &:hover:before {
            height: 32px;
            width: 32px;
        }

        &:disabled > svg > path {
            fill: var(--navds-color-disabled);
        }
    }
`;
