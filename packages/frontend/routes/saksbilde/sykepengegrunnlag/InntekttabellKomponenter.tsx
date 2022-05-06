import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

export const InntektMedKilde = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    > *:not(:last-child) {
        margin-right: 0.5rem;
    }
`;

export const ArbeidsgiverRad = styled.button<{ erGjeldende: boolean }>`
    display: contents;
    padding: 0.25rem;

    > * {
        ${(props) =>
            props.erGjeldende &&
            css`
                background-color: var(--speil-light-hover);
            `};
    }

    &:hover > * {
        background-color: var(--navds-global-color-gray-100);
        cursor: pointer;
        ${({ erGjeldende }) =>
            erGjeldende &&
            css`
                background-color: var(--speil-light-hover);
            `}
    }

    > *:not(:first-of-type) {
        margin: 0 0 0 -2rem;
        padding-left: 1rem;
    }
`;

const BoldTitle = styled(BodyShort)`
    font-weight: 600;
    color: var(--navds-global-color-gray-800);
    margin-bottom: 1rem;
`;

export const Kategoritittel: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => (
    <BoldTitle as="p" {...props}>
        {props.children}
    </BoldTitle>
);

const SmallTitle = styled(BodyShort)`
    font-size: 14px;
`;

export const Kolonnetittel: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (props) => (
    <SmallTitle as="p" {...props}>
        {props.children}
    </SmallTitle>
);

export const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid var(--navds-semantic-color-text);
    grid-column-start: 1;
    grid-column-end: 4;
    margin: 0.25rem 0;
`;

export const Total = styled(BodyShort)`
    text-align: right;
    margin-right: 2.25rem;
`;
