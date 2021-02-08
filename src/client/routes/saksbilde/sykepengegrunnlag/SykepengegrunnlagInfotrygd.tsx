import React from 'react';
import styled from '@emotion/styled';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { somPenger } from '../../../utils/locale';
import { Inntektsgrunnlag } from 'internal-types';
import { Kilde } from '../../../components/Kilde';
import { kilde } from '../../../utils/inntektskilde';
import { ArbeidsgiverRad, InntektMedKilde, Kategoritittel, Kolonnetittel } from './InntekttabellKomponenter';

interface SykepengegrunnlagInfotrygdProps {
    inntektsgrunnlag: Inntektsgrunnlag;
    className?: string;
}

const Oppsummering = styled.div`
    margin-top: 4rem;
    display: grid;
    grid-template-columns: 27rem max-content;

    > * {
        margin-bottom: 3rem;
    }
`;

const Sammenligning = styled.div`
    display: grid;
    grid-template-columns: 25rem max-content;
    grid-gap: 0.5rem;
    grid-column-gap: 2rem;
    margin-bottom: 4.5rem;
`;

export const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid var(--navds-color-text-primary);
    grid-column-start: 1;
    grid-column-end: 3;
    margin: 0.25rem 0;
`;

const SykepengegrunnlagInfotrygd = ({ inntektsgrunnlag, className }: SykepengegrunnlagInfotrygdProps) => (
    <div>
        <Sammenligning>
            <div />
            <Kategoritittel>Inntektsgrunnlag</Kategoritittel>
            <Kolonnetittel>Inntektskilde</Kolonnetittel>
            <Kolonnetittel>Sykepengegrunnlag før 6G</Kolonnetittel>
            {inntektsgrunnlag.inntekter.map((inntekt, index) => (
                <ArbeidsgiverRad
                    key={index}
                    erGjeldende={inntektsgrunnlag.organisasjonsnummer === inntekt.organisasjonsnummer}
                >
                    <div>
                        <Normaltekst
                            style={{ marginLeft: '0.25rem' }}
                        >{`${inntekt.arbeidsgivernavn} (${inntekt.organisasjonsnummer})`}</Normaltekst>
                    </div>
                    <InntektMedKilde>
                        <Normaltekst>
                            {inntekt.omregnetÅrsinntekt ? somPenger(inntekt.omregnetÅrsinntekt.beløp) : 'Ukjent'}
                        </Normaltekst>
                        {inntekt.omregnetÅrsinntekt && <Kilde>{kilde(inntekt.omregnetÅrsinntekt.kilde)}</Kilde>}
                    </InntektMedKilde>
                </ArbeidsgiverRad>
            ))}
            <Divider />
            <Element>Total</Element>
            <Element>{somPenger(inntektsgrunnlag.omregnetÅrsinntekt)}</Element>
        </Sammenligning>
        <Oppsummering className={className}>
            <Element>Sykepengegrunnlag</Element>
            <Element>{somPenger(inntektsgrunnlag.sykepengegrunnlag as number | undefined)}</Element>
        </Oppsummering>
    </div>
);

export default SykepengegrunnlagInfotrygd;
