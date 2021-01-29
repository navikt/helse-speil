import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { somPenger } from '../../../utils/locale';
import styled from '@emotion/styled';
import { Kilde } from '../../../components/Kilde';
import { Inntektskildetype, OmregnetÅrsinntekt, Sammenligningsgrunnlag } from 'internal-types';

interface Props {
    arbeidsgiver: string;
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
    sammenligningsgrunnlag?: Sammenligningsgrunnlag;
    erGjeldende: boolean;
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
        ${(props) => (props.erGjeldende ? 'background-color: var(--speil-light-hover)' : '')};
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

const Inntektssammenligning = ({ arbeidsgiver, omregnetÅrsinntekt, sammenligningsgrunnlag, erGjeldende }: Props) => (
    <ArbeidsgiverRad erGjeldende={erGjeldende}>
        <Normaltekst style={{ marginLeft: '0.25rem' }}>{arbeidsgiver}</Normaltekst>
        <InntektMedKilde>
            <Normaltekst>{omregnetÅrsinntekt ? somPenger(omregnetÅrsinntekt.beløp) : 'Ukjent'}</Normaltekst>
            {omregnetÅrsinntekt && <Kilde>{kilde(omregnetÅrsinntekt.kilde)}</Kilde>}
        </InntektMedKilde>
        <InntektMedKilde>
            <Normaltekst>{somPenger(sammenligningsgrunnlag?.beløp)}</Normaltekst>
            <Kilde>AO</Kilde>
        </InntektMedKilde>
    </ArbeidsgiverRad>
);

export default Inntektssammenligning;
