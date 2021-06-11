import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Kildetype } from 'internal-types';
import React from 'react';

interface KildeProps {
    type?: Kildetype;
}

const ainntektStyle = (props: KildeProps) =>
    props.type === Kildetype.Ainntekt &&
    css`
        background-color: #cce2f0;
    `;

const aordningenStyle = (props: KildeProps) =>
    props.type === Kildetype.Aordningen &&
    css`
        background-color: #ccf1d6;
    `;

const sykmeldingStyle = (props: KildeProps) =>
    props.type === Kildetype.Sykmelding &&
    css`
        background-color: #d8f9ff;
    `;

const søknadStyle = (props: KildeProps) =>
    props.type === Kildetype.Søknad &&
    css`
        background-color: #e0dae7;
    `;

const inntektsmeldingStyle = (props: KildeProps) =>
    props.type === Kildetype.Inntektsmelding &&
    css`
        background-color: #ecefcc;
    `;

export const Kilde = styled.div<KildeProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1px 0.25rem;
    font-size: 14px;
    border-radius: 2px;
    background-color: var(--navds-layout-background-gray);
    color: var(--navds-color-action-default);
    width: 1.25rem;
    height: 0.875rem;
    line-height: 0.875rem;
    box-sizing: border-box;

    ${ainntektStyle};
    ${aordningenStyle};
    ${sykmeldingStyle};
    ${søknadStyle};
    ${inntektsmeldingStyle};
`;
