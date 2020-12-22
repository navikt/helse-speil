import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { somPenger } from '../../../utils/locale';
import styled from '@emotion/styled';
import { Kilde } from '../../../components/Kilde';
import { Inntektskildetype, OmregnetÅrsinntekt, Sammenligningsgrunnlag } from 'internal-types';

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

const kilde = (kilde: Inntektskildetype) => {
    switch (kilde) {
        case Inntektskildetype.Saksbehandler:
            return 'SB';
        case Inntektskildetype.Inntektsmelding:
            return 'IM';
        case Inntektskildetype.Infotrygd:
            return 'IT';
        case Inntektskildetype.AOrdningen:
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
        <Normaltekst style={{ marginLeft: '0.25rem' }}>{arbeidsgiver}</Normaltekst>
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
