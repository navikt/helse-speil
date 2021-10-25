import styled from '@emotion/styled';

export const RoundedButton = styled.button`
    height: 28px;
    width: 28px;
    background-color: transparent;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    > svg {
        flex-shrink: 0;
    }

    &:hover {
        cursor: pointer;
    }

    &:hover,
    &:focus-visible {
        background-color: var(--navds-layout-background-gray);
    }

    &:focus-visible {
        box-shadow: var(--navds-shadow-focus);
    }

    &:active {
        background-color: var(--navds-color-action-default);
        > svg > g,
        > svg > path {
            fill: #fff;
        }
    }
`;
