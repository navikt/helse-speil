import styled from '@emotion/styled';

export const ToggleOverstyringKnapp = styled.button`
    position: absolute;
    top: 1rem;
    right: 0;
    border: none;
    background: none;
    display: flex;
    align-items: flex-end;
    outline: none;
    cursor: pointer;
    color: var(--navds-semantic-color-interaction-primary);
    font-size: 1rem;
    font-family: inherit;

    > svg {
        margin-right: 0.25rem;
    }

    &:focus,
    &:hover {
        text-decoration: underline;
    }
`;
