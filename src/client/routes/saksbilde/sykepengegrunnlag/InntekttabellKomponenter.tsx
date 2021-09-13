import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Element, Undertekst } from 'nav-frontend-typografi';

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
        background-color: var(--navds-color-gray-10);
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

export const Kategoritittel = styled(Element)`
    color: var(--navds-color-gray-80);
    margin-bottom: 1rem;
`;

export const Kolonnetittel = styled(Undertekst)`
    color: var(--navds-color-text-primary);
`;

export const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid var(--navds-color-text-primary);
    grid-column-start: 1;
    grid-column-end: 4;
    margin: 0.25rem 0;
`;

export const Total = styled(Element)`
    text-align: right;
    margin-right: 2.25rem;
`;
