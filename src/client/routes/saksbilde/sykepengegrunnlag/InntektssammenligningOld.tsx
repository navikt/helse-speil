import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import { somPenger } from '../../../utils/locale';
import styled from '@emotion/styled';
import { Kilde } from '../../../components/Kilde';

interface Props {
    inntektskilde: string;
    årsinntektAordning?: number;
    årsinntektInntektsmelding?: number;
}

const Kategoritittel = styled(Element)`
    color: #59514b;
    margin-bottom: 1rem;
`;

const Kolonnetittel = styled(Undertekst)`
    color: #3e3832;
`;

const Sammenligning = styled.div`
    display: grid;
    grid-template-columns: 13rem max-content max-content;
    grid-gap: 0.5rem;
    grid-column-gap: 2rem;
    margin-bottom: 4.5rem;
`;

const InntektMedKilde = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;

    > *:not(:last-child) {
        margin-right: 0.5rem;
    }
`;

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid #3e3832;
    grid-column-start: 1;
    grid-column-end: 4;
    margin: 0.25rem 0;
`;

export const InntektssammenligningOld = ({ inntektskilde, årsinntektAordning, årsinntektInntektsmelding }: Props) => (
    <Sammenligning>
        <div />
        <Kategoritittel>Inntektsgrunnlag</Kategoritittel>
        <Kategoritittel>Sammenligningsgrunnlag</Kategoritittel>
        <Kolonnetittel>Inntektskilde</Kolonnetittel>
        <Kolonnetittel>Omregnet årsinntekt</Kolonnetittel>
        <Kolonnetittel>Rapportert årsinntekt</Kolonnetittel>
        <Normaltekst>{inntektskilde}</Normaltekst>
        <InntektMedKilde>
            <Normaltekst>{somPenger(årsinntektInntektsmelding)}</Normaltekst>
            <Kilde>IM</Kilde>
        </InntektMedKilde>
        <InntektMedKilde>
            <Normaltekst>{somPenger(årsinntektAordning)}</Normaltekst>
            <Kilde>Ao</Kilde>
        </InntektMedKilde>
        <Divider />
        <Element>Total</Element>
        <Element>{somPenger(årsinntektInntektsmelding)}</Element>
        <Element>{somPenger(årsinntektAordning)}</Element>
    </Sammenligning>
);
