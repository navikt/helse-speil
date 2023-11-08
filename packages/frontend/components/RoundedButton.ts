import styled from '@emotion/styled';

export const RoundedButton = styled.button`
    height: 32px;
    width: 32px;
    background-color: transparent;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.1s ease;

    > svg {
        flex-shrink: 0;
    }

    &:hover {
        cursor: pointer;
    }

    &:hover,
    &:focus-visible {
        background: var(--a-surface-action-subtle-hover);
    }

    &:focus-visible {
        box-shadow: var(--a-shadow-focus);
    }

    &:active {
        background-color: var(--a-surface-action-selected);

        > svg > g,
        > svg > path {
            fill: #fff;
        }
    }
`;
