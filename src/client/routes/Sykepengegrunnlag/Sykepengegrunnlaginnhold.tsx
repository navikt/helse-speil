import { Sykepengegrunnlag } from '../../context/types.internal';
import Inntektssammenligning from './Inntektssammenligning';
import Avvikssammenligning from './Avvikssammenligning';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { somPenger } from '../../utils/locale';
import React from 'react';
import styled from '@emotion/styled';

interface SykepengegrunnlaginnholdProps {
    sykepengegrunnlag: Sykepengegrunnlag;
}

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid #e7e9e9;
    margin-bottom: 2rem;
`;

const Oppsummering = styled.div`
    display: grid;
    grid-template-columns: 15rem max-content;

    > * {
        margin-bottom: 3rem;
    }
`;

const Innhold = styled.div`
    margin-top: 2rem;
`;

const Sykepengegrunnlaginnhold = ({ sykepengegrunnlag }: SykepengegrunnlaginnholdProps) => (
    <Innhold>
        {' '}
        <Inntektssammenligning
            inntektskilde="Arbeidsgiver"
            årsinntektAordning={sykepengegrunnlag.årsinntektFraAording}
            årsinntektInntektsmelding={sykepengegrunnlag.årsinntektFraInntektsmelding!}
        />
        <Divider />
        {sykepengegrunnlag.avviksprosent !== undefined && sykepengegrunnlag.avviksprosent !== null
            ? sykepengegrunnlag.årsinntektFraAording && (
                  <>
                      <Avvikssammenligning
                          avvik={sykepengegrunnlag.avviksprosent}
                          totalOmregnetÅrsinntekt={sykepengegrunnlag.årsinntektFraInntektsmelding!}
                          totalRapportertÅrsinntekt={sykepengegrunnlag.årsinntektFraAording}
                      />
                      <Divider />
                  </>
              )
            : null}
        <Oppsummering>
            <Element>Sykepengegrunnlag</Element>
            <Element>{somPenger(sykepengegrunnlag.sykepengegrunnlag as number | undefined)}</Element>
        </Oppsummering>
    </Innhold>
);

export default Sykepengegrunnlaginnhold;
