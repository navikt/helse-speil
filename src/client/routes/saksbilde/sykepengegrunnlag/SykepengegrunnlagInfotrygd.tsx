import styled from '@emotion/styled';
import { Inntektsgrunnlag } from 'internal-types';
import React from 'react';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { Kilde } from '../../../components/Kilde';
import { useSkalAnonymiserePerson } from '../../../state/person';
import { kilde } from '../../../utils/inntektskilde';
import { somPenger } from '../../../utils/locale';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { ArbeidsgiverRad, InntektMedKilde, Kategoritittel, Kolonnetittel, Total } from './InntekttabellKomponenter';

interface SykepengegrunnlagInfotrygdProps {
    inntektsgrunnlag: Inntektsgrunnlag;
    className?: string;
}

const Oppsummering = styled.div`
    margin-top: 4rem;
    display: grid;
    grid-template-columns: 27rem auto;

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

const SykepengegrunnlagInfotrygd = ({ inntektsgrunnlag, className }: SykepengegrunnlagInfotrygdProps) => {
    const anonymiseringEnabled = useSkalAnonymiserePerson();
    return (
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
                            <Normaltekst style={{ marginLeft: '0.25rem' }}>
                                {anonymiseringEnabled
                                    ? `${getAnonymArbeidsgiverForOrgnr(inntekt.organisasjonsnummer).navn}`
                                    : inntekt.arbeidsgivernavn.toLowerCase() !== 'ikke tilgjengelig'
                                    ? `${inntekt.arbeidsgivernavn} (${inntekt.organisasjonsnummer})`
                                    : inntekt.organisasjonsnummer}
                            </Normaltekst>
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
                <Total>{somPenger(inntektsgrunnlag.omregnetÅrsinntekt)}</Total>
            </Sammenligning>
            <Oppsummering className={className}>
                <Element>Sykepengegrunnlag</Element>
                <Total>{somPenger(inntektsgrunnlag.sykepengegrunnlag as number | undefined)}</Total>
            </Oppsummering>
        </div>
    );
};

export default SykepengegrunnlagInfotrygd;
