import { Inntektsgrunnlag } from 'internal-types';
import Inntektssammenligning from './Inntektssammenligning';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { somPenger } from '../../../utils/locale';
import React from 'react';
import styled from '@emotion/styled';
import Avvikssammenligning from './Avvikssammenligning';

interface InntektsgrunnlaginnholdProps {
    inntektsgrunnlag: Inntektsgrunnlag;
}

const Oppsummering = styled.div`
    margin-top: 4rem;
    display: grid;
    grid-template-columns: 15rem max-content;

    > * {
        margin-bottom: 3rem;
    }
`;

const Sammenligning = styled.div`
    display: grid;
    grid-template-columns: 13rem max-content max-content;
    grid-gap: 0.5rem;
    grid-column-gap: 2rem;
    margin-bottom: 4.5rem;
`;

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid var(--navds-color-text-primary);
    grid-column-start: 1;
    grid-column-end: 4;
    margin: 0.25rem 0;
`;

const Kategoritittel = styled(Element)`
    color: var(--navds-color-text-primary);
    margin-bottom: 1rem;
`;

const Kolonnetittel = styled(Undertekst)`
    margin-left: 0.25rem;
    color: var(--navds-color-text-primary);
`;

const Inntektsgrunnlaginnhold = ({ inntektsgrunnlag }: InntektsgrunnlaginnholdProps) => (
    <div>
        <Sammenligning>
            <div />
            <Kategoritittel>Inntektsgrunnlag</Kategoritittel>
            <Kategoritittel>Sammenligningsgrunnlag</Kategoritittel>
            <Kolonnetittel>Inntektskilde</Kolonnetittel>
            <Kolonnetittel>Omregnet årsinntekt</Kolonnetittel>
            <Kolonnetittel>Rapportert årsinntekt</Kolonnetittel>
            {inntektsgrunnlag.inntekter.map((inntekt) => (
                <Inntektssammenligning
                    arbeidsgiver={`${inntekt.arbeidsgivernavn} (${inntekt.organisasjonsnummer})`}
                    omregnetÅrsinntekt={inntekt.omregnetÅrsinntekt}
                    sammenligningsgrunnlag={inntekt.sammenligningsgrunnlag}
                    erGjeldende={inntektsgrunnlag.organisasjonsnummer === inntekt.organisasjonsnummer}
                />
            ))}
            <Divider />
            <Element>Total</Element>
            <Element>{somPenger(inntektsgrunnlag.omregnetÅrsinntekt)}</Element>
            <Element>{somPenger(inntektsgrunnlag.sammenligningsgrunnlag)}</Element>
        </Sammenligning>
        <Avvikssammenligning
            avvik={inntektsgrunnlag.avviksprosent}
            totalOmregnetÅrsinntekt={inntektsgrunnlag.omregnetÅrsinntekt}
            totalRapportertÅrsinntekt={inntektsgrunnlag.sammenligningsgrunnlag}
        />
        <Oppsummering>
            <Element>Sykepengegrunnlag</Element>
            <Element>{somPenger(inntektsgrunnlag.sykepengegrunnlag as number | undefined)}</Element>
        </Oppsummering>
    </div>
);

export default Inntektsgrunnlaginnhold;
