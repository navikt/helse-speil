import { Sykepengegrunnlag } from 'internal-types';
import Inntektssammenligning from './Inntektssammenligning';
import Avvikssammenligning from './Avvikssammenligning';
import { Element } from 'nav-frontend-typografi';
import { somPenger } from '../../../utils/locale';
import React from 'react';
import styled from '@emotion/styled';

interface SykepengegrunnlaginnholdProps {
    sykepengegrunnlag: Sykepengegrunnlag;
    className?: string;
}

const Oppsummering = styled.div`
    margin-top: 4rem;
    display: grid;
    grid-template-columns: 15rem max-content;

    > * {
        margin-bottom: 3rem;
    }
`;

const Sykepengegrunnlaginnhold = ({ sykepengegrunnlag, className }: SykepengegrunnlaginnholdProps) => (
    <div className={className}>
        {' '}
        <Inntektssammenligning
            inntektskilde="Arbeidsgiver"
            årsinntektAordning={sykepengegrunnlag.årsinntektFraAording}
            årsinntektInntektsmelding={sykepengegrunnlag.årsinntektFraInntektsmelding!}
        />
        {sykepengegrunnlag.avviksprosent !== undefined && sykepengegrunnlag.avviksprosent !== null
            ? sykepengegrunnlag.årsinntektFraAording && (
                  <Avvikssammenligning
                      avvik={sykepengegrunnlag.avviksprosent}
                      totalOmregnetÅrsinntekt={sykepengegrunnlag.årsinntektFraInntektsmelding!}
                      totalRapportertÅrsinntekt={sykepengegrunnlag.årsinntektFraAording}
                  />
              )
            : null}
        <Oppsummering>
            <Element>Sykepengegrunnlag</Element>
            <Element>{somPenger(sykepengegrunnlag.sykepengegrunnlag as number | undefined)}</Element>
        </Oppsummering>
    </div>
);

export default Sykepengegrunnlaginnhold;
