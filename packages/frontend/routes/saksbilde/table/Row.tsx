import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { helgetyper } from '../utbetaling/utbetalingstabell/helgUtils';

interface RowProps {
    erAvvist?: boolean;
    erAGP?: boolean;
    type?: Utbetalingstabelldagtype;
    markertDag?: UtbetalingstabellDag;
    nyDag?: boolean;
    erHelg?: boolean;
}

const leftAlignedLine = (color: string) => css`
    > td:first-of-type {
        position: relative;
    }

    > td:first-of-type:before {
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
    ((props.type && [...helgetyper, 'Helg'].includes(props.type)) || props.erHelg) &&
    css`
        background: repeating-linear-gradient(
            123deg,
            var(--speil-light-hover),
            var(--speil-light-hover) 1px,
            transparent 1px,
            transparent 9px
        );
    `;

const avvistStyle = (props: RowProps) =>
    props.erAvvist &&
    css`
        background-color: #f9d2cc;
        ${leftAlignedLine('var(--a-border-danger)')}
    `;

const arbeidsgiverperiodeStyle = (props: RowProps) =>
    props.erAGP &&
    css`
        background-color: #f8f8f8;
        ${leftAlignedLine('var(--a-text-subtle)')}
    `;

const nydagStyle = (props: RowProps) =>
    props.nyDag &&
    css`
        background-color: #fff;
    `;

export const Row = styled.tr<RowProps>`
    position: relative;

    > td {
        position: relative;
        height: 2rem;
        padding: 0 1rem;
        vertical-align: middle;
        box-sizing: border-box;
        border-bottom: 1px solid #c6c2bf;
        background: ${(RowProps) => (RowProps.markertDag ? '#f1f1f1' : 'transparent')};

        &:not(:first-of-type):not(:last-of-type) {
            padding-right: 1rem;
        }
    }

    ${helgStyle};
    ${avvistStyle};
    ${arbeidsgiverperiodeStyle};
    ${nydagStyle};
`;
