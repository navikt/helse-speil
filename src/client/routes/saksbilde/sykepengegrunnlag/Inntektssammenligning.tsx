import { Kildetype, OmregnetÅrsinntekt, Sammenligningsgrunnlag } from 'internal-types';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Kilde } from '../../../components/Kilde';
import { getKildeType, kilde } from '../../../utils/inntektskilde';
import { somPenger } from '../../../utils/locale';

import { ArbeidsgiverRad, InntektMedKilde } from './InntekttabellKomponenter';

interface Props {
    arbeidsgiver: string;
    omregnetÅrsinntekt?: OmregnetÅrsinntekt;
    sammenligningsgrunnlag?: Sammenligningsgrunnlag;
    erGjeldende: boolean;
}

const Inntektssammenligning = ({ arbeidsgiver, omregnetÅrsinntekt, sammenligningsgrunnlag, erGjeldende }: Props) => (
    <ArbeidsgiverRad erGjeldende={erGjeldende}>
        <div>
            <Normaltekst style={{ marginLeft: '0.25rem' }}>{arbeidsgiver}</Normaltekst>
        </div>
        <InntektMedKilde>
            <Normaltekst>{omregnetÅrsinntekt ? somPenger(omregnetÅrsinntekt.beløp) : 'Ukjent'}</Normaltekst>
            {omregnetÅrsinntekt && (
                <Kilde type={getKildeType(omregnetÅrsinntekt.kilde)}>{kilde(omregnetÅrsinntekt.kilde)}</Kilde>
            )}
        </InntektMedKilde>
        <InntektMedKilde>
            <Normaltekst>{somPenger(sammenligningsgrunnlag?.beløp)}</Normaltekst>
            <Kilde type={Kildetype.Aordningen}>AO</Kilde>
        </InntektMedKilde>
    </ArbeidsgiverRad>
);

export default Inntektssammenligning;
