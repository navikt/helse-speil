import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Dagtype } from 'internal-types';
import React from 'react';

interface RowProps {
    type?: Dagtype;
}

const leftAlignedLine = (color: string) => css`
    > td:nth-of-type(2) {
        position: relative;
    }

    > td:nth-of-type(2):before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        background-color: ${color};
        width: 3px;
        height: 2rem;
    }
`;

const helgStyle = (props: RowProps) =>
    props.type === Dagtype.Helg &&
    css`
        background: repeating-linear-gradient(
            123deg,
            var(--speil-light-hover),
            var(--speil-light-hover) 1px,
            var(--navds-color-background) 1px,
            var(--navds-color-background) 9px
        );
    `;

const avvistStyle = (props: RowProps) =>
    props.type === Dagtype.Avvist &&
    css`
        background-color: #f9d2cc;
        ${leftAlignedLine('var(--navds-color-error-border)')}
    `;

const arbeidsgiverperiodeStyle = (props: RowProps) =>
    props.type === Dagtype.Arbeidsgiverperiode &&
    css`
        background-color: #f8f8f8;
        ${leftAlignedLine('var(--navds-color-text-disabled)')}
    `;

export const Row = styled.tr<RowProps>`
    position: relative;

    > td {
        position: relative;
        height: 2rem;
        padding: 0 1rem;
        vertical-align: middle;
        box-sizing: border-box;

        &:not(:first-of-type):not(:last-of-type) {
            padding-right: 1rem;
        }

        &:not(:first-of-type) {
            border-bottom: 1px solid #c6c2bf;
        }
    }

    ${helgStyle};
    ${avvistStyle};
    ${arbeidsgiverperiodeStyle};
`;
