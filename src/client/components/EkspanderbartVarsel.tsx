import React, { ReactNode } from 'react';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';
import { Accordion } from '@navikt/helse-frontend-accordion/lib';
import styled from '@emotion/styled';

const Container = styled(Accordion)`
    > div:first-of-type {
        display: flex;
        flex-direction: column;
    }
    > div:first-of-type > button:first-of-type {
        cursor: pointer;
        position: relative;
        flex: 1;
        padding: 0;
        border: 0;
        outline: none;

        &:focus-visible {
            box-shadow: 0 0 0 3px #254b6d;
        }

        &:before {
            content: 'Les mer';
            position: absolute;
            right: 54px;
            top: 50%;
            transform: translateY(-50%);
            color: #3e3832;
            font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
            font-size: 16px;
            font-weight: 600;
        }

        &:after {
            content: '';
            position: absolute;
            width: 14px;
            height: 8px;
            right: 31px;
            top: 50%;
            transform: translateY(-50%) rotate(180deg);
            background-image: url("data:image/svg+xml,%3Csvg width='14' height='8' viewBox='0 0 14 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.74775 7.70102C1.34793 8.09966 0.699689 8.09966 0.299867 7.70102C-0.0999556 7.30239 -0.0999556 6.65607 0.299867 6.25743L6.27606 0.298977C6.67588 -0.099659 7.32412 -0.099659 7.72394 0.298977L13.7001 6.25743C14.1 6.65607 14.1 7.30239 13.7001 7.70102C13.3003 8.09966 12.6521 8.09966 12.2522 7.70102L7 2.46436L1.74775 7.70102Z' fill='black'/%3E%3C/svg%3E%0A");
        }

        &[aria-expanded='true'] {
            &:before {
                content: 'Les mindre';
            }
            &:after {
                transform: translateY(-50%);
            }
        }
    }
    > div:first-of-type > div:first-of-type {
        overflow: hidden;
    }
`;

const Content = styled.div`
    background: #fff2e0;
    padding: 0.5rem 3.5rem;
`;

interface EkspanderbartVarselProps {
    label: ReactNode;
    children: ReactNode;
    type?: Varseltype;
}

export const EkspanderbartVarsel: React.FC<EkspanderbartVarselProps> = ({
    label,
    children,
    type = Varseltype.Advarsel,
}) => (
    <Container>
        <Varsel type={type}>{label}</Varsel>
        <Content>{children}</Content>
    </Container>
);
