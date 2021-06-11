import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { Row } from '../../table/Row';

const overstyrtRowStyle = (props: SykmeldingsperiodeRowProps) =>
    props.overstyrt &&
    css`
        background-color: #d8f9ff;

        > *:first-of-type {
            position: relative;
        }

        > *:first-of-type:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            background-color: #368da8;
            width: 3px;
            height: 2rem;
        }
    `;

interface SykmeldingsperiodeRowProps {
    overstyrt?: boolean;
}

export const SykmeldingsperiodeRow = styled(Row)<SykmeldingsperiodeRowProps>`
    > td:not(:last-of-type) {
        padding-right: 3rem;
    }

    ${overstyrtRowStyle}
`;
