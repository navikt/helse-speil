import styled from '@emotion/styled';
import { Arbeidsgiverinntekt, Inntektsgrunnlag } from 'internal-types';
import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { somPenger } from '../../../utils/locale';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import Avvikssammenligning from './Avvikssammenligning';
import Inntektssammenligning from './Inntektssammenligning';
import { Divider, Kategoritittel, Kolonnetittel, Total } from './InntekttabellKomponenter';

interface InntektsgrunnlaginnholdProps {
    inntektsgrunnlag: Inntektsgrunnlag;
    anonymiseringEnabled: boolean;
    aktivInntektskilde: Arbeidsgiverinntekt;
    setAktivInntektskilde: (inntektskilde: Arbeidsgiverinntekt) => void;
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

const Inntektsgrunnlaginnhold = ({
    inntektsgrunnlag,
    anonymiseringEnabled,
    aktivInntektskilde,
    setAktivInntektskilde,
}: InntektsgrunnlaginnholdProps) => {
    return (
        <div>
            <Sammenligning>
                <div />
                <Kategoritittel>Inntektsgrunnlag</Kategoritittel>
                <Kategoritittel>Sammenligningsgrunnlag</Kategoritittel>
                <Kolonnetittel>Inntektskilde</Kolonnetittel>
                <Kolonnetittel>Omregnet årsinntekt</Kolonnetittel>
                <Kolonnetittel>Rapportert årsinntekt</Kolonnetittel>
                {inntektsgrunnlag.inntekter.map((inntekt, index) => (
                    <Inntektssammenligning
                        onSetAktivInntektskilde={() => setAktivInntektskilde(inntekt)}
                        key={inntekt.organisasjonsnummer + index}
                        arbeidsgiver={
                            anonymiseringEnabled
                                ? `${getAnonymArbeidsgiverForOrgnr(inntekt.organisasjonsnummer).navn}`
                                : inntekt.arbeidsgivernavn.toLowerCase() !== 'ikke tilgjengelig'
                                ? `${inntekt.arbeidsgivernavn} (${inntekt.organisasjonsnummer})`
                                : inntekt.organisasjonsnummer
                        }
                        omregnetÅrsinntekt={inntekt.omregnetÅrsinntekt}
                        sammenligningsgrunnlag={inntekt.sammenligningsgrunnlag}
                        erGjeldende={aktivInntektskilde.organisasjonsnummer === inntekt.organisasjonsnummer}
                    />
                ))}
                <Divider />
                <Element>Total</Element>
                <Total>{somPenger(inntektsgrunnlag.omregnetÅrsinntekt)}</Total>
                <Total>{somPenger(inntektsgrunnlag.sammenligningsgrunnlag)}</Total>
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
};

export default Inntektsgrunnlaginnhold;
