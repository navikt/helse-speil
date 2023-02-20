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
        background-color: var(--navds-global-color-deepblue-100);
        border-color: var(--navds-global-color-deepblue-500);
    `;

const aordningenStyle = (props: KildeProps) =>
    props.type === Inntektskilde.Aordningen &&
    css`
        background-color: var(--navds-global-color-green-100);
        border-color: var(--navds-global-color-green-500);
    `;

const sykmeldingStyle = (props: KildeProps) =>
    props.type === Kildetype.Sykmelding &&
    css`
        background-color: var(--navds-global-color-lightblue-100);
        border-color: var(--navds-global-color-blue-500);
    `;

const søknadStyle = (props: KildeProps) =>
    props.type === Kildetype.Soknad &&
    css`
        background-color: var(--navds-global-color-purple-100);
        border-color: var(--navds-global-color-purple-400);
    `;

const inntektsmeldingStyle = (props: KildeProps) =>
    props.type === Kildetype.Inntektsmelding &&
    css`
        background-color: var(--navds-global-color-limegreen-100);
        border-color: var(--navds-global-color-orange-600);
    `;

const saksbehandlerStyle = (props: KildeProps) =>
    props.type === Kildetype.Saksbehandler &&
    css`
        background-color: var(--navds-global-color-gray-100);
        color: var(--navds-semantic-color-text);
        border-color: var(--navds-global-color-gray-700);
        svg {
            width: 10px;
            height: 10px;
        }
    `;

export const Kilde = styled.div<KildeProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    letter-spacing: 0.4px;
    margin-right: -0.4px;
    border-radius: 3px;
    border-style: solid;
    border-width: 1px;
    background-color: transparent;
    color: var(--navds-semantic-color-interaction-primary);
    width: 1.25rem;
    height: 1rem;
    line-height: 8px;
    box-sizing: border-box;

    ${ainntektStyle};
    ${aordningenStyle};
    ${sykmeldingStyle};
    ${søknadStyle};
    ${inntektsmeldingStyle};
    ${saksbehandlerStyle};
`;
