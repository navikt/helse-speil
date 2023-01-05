import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { Inntektskilde, Kildetype } from '@io/graphql';

interface KildeProps {
    type?: Kildetype | Inntektskilde | 'AINNTEKT';
}

const ainntektStyle = (props: KildeProps) =>
    props.type === 'AINNTEKT' &&
    css`
        background-color: #cce2f0;
    `;

const aordningenStyle = (props: KildeProps) =>
    props.type === Inntektskilde.Aordningen &&
    css`
        background-color: #ccf1d6;
    `;

const sykmeldingStyle = (props: KildeProps) =>
    props.type === Kildetype.Sykmelding &&
    css`
        background-color: #d8f9ff;
    `;

const søknadStyle = (props: KildeProps) =>
    props.type === Kildetype.Soknad &&
    css`
        background-color: #e0dae7;
    `;

const inntektsmeldingStyle = (props: KildeProps) =>
    props.type === Kildetype.Inntektsmelding &&
    css`
        background-color: #ecefcc;
    `;

const saksbehandlerStyle = (props: KildeProps) =>
    props.type === Kildetype.Saksbehandler &&
    css`
        background-color: var(--navds-global-color-gray-100);
        color: var(--navds-semantic-color-text);
        svg {
            width: 12px;
            height: 12px;
        }
    `;

export const Kilde = styled.div<KildeProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1px 0.25rem;
    font-size: 14px;
    border-radius: 2px;
    background-color: transparent;
    color: var(--navds-semantic-color-interaction-primary);
    width: 1.25rem;
    height: 0.875rem;
    line-height: 0.875rem;
    box-sizing: border-box;

    ${ainntektStyle};
    ${aordningenStyle};
    ${sykmeldingStyle};
    ${søknadStyle};
    ${inntektsmeldingStyle};
    ${saksbehandlerStyle};
`;
