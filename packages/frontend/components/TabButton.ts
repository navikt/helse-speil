import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const TabButton = styled.button<{ active?: boolean; disabled?: boolean }>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background: none;
    outline: none;
    border: none;
    cursor: pointer;
    padding: 0 13px;
    transition: background-color 0.1s ease;

    ${(props) =>
        !props.disabled &&
        css`
            &:hover {
                background-color: var(--a-surface-action-subtle-hover);
            }

            &:active {
                background-color: var(--a-surface-action-selected);

                path {
                    fill: white;
                }
            }

            &:focus-visible {
                box-shadow: inset 0 0 0 3px var(--a-border-focus);
            }
        `}

    &:before {
        position: absolute;
        content: '';
        background: var(--a-surface-action);
        bottom: 0;
        left: 0;
        height: 0;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        width: 100%;
        transition: height 0.1s ease;
    }

    ${(props) =>
        props.active &&
        css`
            &:before {
                height: 4px;
            }
        `}
`;
