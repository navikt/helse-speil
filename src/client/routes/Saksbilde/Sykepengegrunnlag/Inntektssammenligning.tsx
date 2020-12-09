import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { somPenger } from '../../../utils/locale';
import styled from '@emotion/styled';
import { Kilde } from '../../../components/Kilde';
import { Inntektkilde, OmregnetÅrsinntekt, Sammenligningsgrunnlag } from 'internal-types';

interface Props {
    arbeidsgiver: string;
    omregnetÅrsinntekt: OmregnetÅrsinntekt;
    sammenligningsgrunnlag?: Sammenligningsgrunnlag;
    erGjeldende: boolean;
    className?: string;
}

const InntektMedKilde = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;

    > *:not(:last-child) {
        margin-right: 0.5rem;
    }
`;

type ArbeidsgiverRadProps = {
    erGjeldende: boolean;
};

const ArbeidsgiverRad = styled.div<ArbeidsgiverRadProps>`
    display: contents;

    > * {
        ${(props) => (props.erGjeldende ? 'background-color: #E7E9E9' : '')};
    }

    > *:not(:first-child) {
        margin: 0 0 0 -2rem;
        padding: 0 2rem;
    }
`;

const kilde = (kilde: Inntektkilde) => {
    switch (kilde) {
        case Inntektkilde.Saksbehandler:
            return 'SB';
        case Inntektkilde.Inntektsmelding:
            return 'IM';
        case Inntektkilde.Infotrygd:
            return 'IT';
        case Inntektkilde.AOrdningen:
            return 'AO';
    }
};

const Inntektssammenligning = ({
    arbeidsgiver,
    omregnetÅrsinntekt,
    sammenligningsgrunnlag,
    erGjeldende,
    className = 'Inntektssammenligning',
}: Props) => (
    <ArbeidsgiverRad erGjeldende={erGjeldende}>
        <Normaltekst>{arbeidsgiver}</Normaltekst>
        <InntektMedKilde>
            <Normaltekst>{somPenger(omregnetÅrsinntekt.beløp)}</Normaltekst>
            <Kilde>{kilde(omregnetÅrsinntekt.kilde)}</Kilde>
        </InntektMedKilde>
        <InntektMedKilde>
            <Normaltekst>{somPenger(sammenligningsgrunnlag?.beløp)}</Normaltekst>
            <Kilde>AO</Kilde>
        </InntektMedKilde>
    </ArbeidsgiverRad>
);

export default Inntektssammenligning;
