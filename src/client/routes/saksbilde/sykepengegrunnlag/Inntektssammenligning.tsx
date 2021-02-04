import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { somPenger } from '../../../utils/locale';
import styled from '@emotion/styled';
import { Kilde } from '../../../components/Kilde';
import { Inntektskildetype, OmregnetÅrsinntekt, Sammenligningsgrunnlag } from 'internal-types';
import { kilde } from '../../../utils/inntektskilde';

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

    > *:not(:first-of-type) {
        margin: 0 0 0 -2rem;
        padding: 0 2rem;
    }
`;

const Inntektssammenligning = ({ arbeidsgiver, omregnetÅrsinntekt, sammenligningsgrunnlag, erGjeldende }: Props) => (
    <ArbeidsgiverRad erGjeldende={erGjeldende}>
        <div>
            <Normaltekst style={{ marginLeft: '0.25rem' }}>{arbeidsgiver}</Normaltekst>
        </div>
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
