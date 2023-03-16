import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { Inntektskilde, Kildetype } from '@io/graphql';

interface KildeProps {
    type: KildeikonType;
    children?: ReactNode;
    className?: string;
}

type KildeikonType = Kildetype | Inntektskilde | 'AINNTEKT' | undefined;

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

const getKildeTypeTooltip = (kilde: KildeikonType): string => {
    switch (kilde) {
        case Inntektskilde.Inntektsmelding:
        case Kildetype.Inntektsmelding:
            return 'Inntektsmelding';
        case Kildetype.Soknad:
            return 'Søknad';
        case Kildetype.Sykmelding:
            return 'Sykmelding';
        case Kildetype.Saksbehandler:
            return 'Saksbehandler';
        case Inntektskilde.Aordningen:
            return 'A-ordningen';
        case Inntektskilde.IkkeRapportert:
            return 'Ikke rapportert';
        case Inntektskilde.Saksbehandler:
            return 'Saksbehandler';
        case 'AINNTEKT':
            return 'A-inntekt';
        default:
            return 'Ukjent';
    }
};

const Kildeikon = styled.div<KildeProps>`
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
    color: var(--navds-semantic-color-text);
    width: 1.25rem;
    height: 1rem;
    line-height: 8px;
    box-sizing: border-box;
    cursor: default;

    ${ainntektStyle};
    ${aordningenStyle};
    ${sykmeldingStyle};
    ${søknadStyle};
    ${inntektsmeldingStyle};
    ${saksbehandlerStyle};
`;

export const Kilde = ({ type, children, className }: KildeProps) => {
    return (
        <Tooltip content={getKildeTypeTooltip(type)}>
            <Kildeikon className={className} type={type}>
                {children}
            </Kildeikon>
        </Tooltip>
    );
};
