import {Element, Normaltekst, Undertekst} from 'nav-frontend-typografi';
import { somPenger } from '../../../utils/locale';
import React from 'react';
import styled from '@emotion/styled';
import Inntektssammenligning from "./Inntektssammenligning";
import Avvikssammenligning from "./Avvikssammenligning";
import {Arbeidsgiverinntekt, Inntektsgrunnlag} from "internal-types";
import {Kilde} from "../../../components/Kilde";
import {kilde} from "../../../utils/inntektskilde";

interface SykepengegrunnlagInfotrygdProps {
    inntektsgrunnlag: Inntektsgrunnlag;
    className?: string;
}

const Oppsummering = styled.div`
    margin-top: 4rem;
    display: grid;
    grid-template-columns: 27rem max-content;
}

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

const Divider = styled.hr`
    border: none;
    border-bottom: 1px solid var(--navds-color-text-primary);
    grid-column-start: 1;
    grid-column-end: 3;
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

const InntektMedKilde = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;

    > *:not(:last-child) {
        margin-right: 0.5rem;
    }
`;

/*<Innhold className={className}>
<Element>Sykepengegrunnlag</Element>
<Element>{somPenger(inntektFraInfotrygd as number)}</Element>
</Innhold>*/

/*
* <Inntektssammenligning
    key={inntekt.organisasjonsnummer + index}
    arbeidsgiver={`${inntekt.arbeidsgivernavn} (${inntekt.organisasjonsnummer})`}
    omregnetÅrsinntekt={inntekt.omregnetÅrsinntekt}
    erGjeldende={inntektsgrunnlag.organisasjonsnummer === inntekt.organisasjonsnummer}
/>
* */

const SykepengegrunnlagInfotrygd = ({ inntektsgrunnlag, className }: SykepengegrunnlagInfotrygdProps) => (
    <div>
        <Sammenligning>
            <div/>
            <Kategoritittel>Inntektsgrunnlag</Kategoritittel>
            <Kolonnetittel>Inntektskilde</Kolonnetittel>
            <Kolonnetittel>Omregnet årsinntekt</Kolonnetittel>
            {inntektsgrunnlag.inntekter.map((inntekt, index) => (
                <ArbeidsgiverRad key={index} erGjeldende={inntektsgrunnlag.organisasjonsnummer === inntekt.organisasjonsnummer}>
                    <div>
                        <Normaltekst style={{ marginLeft: '0.25rem' }}>{`${inntekt.arbeidsgivernavn} (${inntekt.organisasjonsnummer})`}</Normaltekst>
                    </div>
                    <InntektMedKilde>
                        <Normaltekst>{inntekt.omregnetÅrsinntekt ? somPenger(inntekt.omregnetÅrsinntekt.beløp) : 'Ukjent'}</Normaltekst>
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
