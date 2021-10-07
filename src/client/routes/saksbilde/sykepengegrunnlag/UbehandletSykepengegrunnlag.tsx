import styled from '@emotion/styled';
import React, { useState } from 'react';

import { InntektsgrunnlagTable } from './InntektsgrunnlagTable';
import { Inntektskilderinnhold } from './Inntektskilderinnhold';

const Container = styled.div`
    display: flex;
    margin-top: 1rem;
    align-content: space-between;
`;

const Strek = styled.span`
    border-right: 1px solid var(--navds-color-border);
    height: inherit;
    display: inline-block;
    margin: 0 2.5rem;
`;

const getInntekt = (
    vilkårsgrunnlag: ExternalVilkårsgrunnlag,
    organisasjonsnummer: string
): ExternalArbeidsgiverinntekt =>
    vilkårsgrunnlag.inntekter.find(
        (it) => it.organisasjonsnummer === organisasjonsnummer
    ) as ExternalArbeidsgiverinntekt;

export interface UbehandletSykepengegrunnlagProps {
    vilkårsgrunnlag: ExternalSpleisVilkårsgrunnlag;
    organisasjonsnummer: string;
}

export const UbehandletSykepengegrunnlag = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
}: UbehandletSykepengegrunnlagProps) => {
    const [aktivInntektskilde, setAktivInntektskilde] = useState<ExternalArbeidsgiverinntekt>(
        getInntekt(vilkårsgrunnlag, organisasjonsnummer)
    );

    return (
        <Container>
            <Inntektskilderinnhold inntekt={aktivInntektskilde} />
            <Strek />
            <InntektsgrunnlagTable
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={vilkårsgrunnlag.omregnetÅrsinntekt}
                sammenligningsgrunnlag={vilkårsgrunnlag.sammenligningsgrunnlag}
                avviksprosent={vilkårsgrunnlag.avviksprosent}
                sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                gjeldendeOrganisasjonsnummer={organisasjonsnummer}
                setAktivInntektskilde={setAktivInntektskilde}
            />
        </Container>
    );
};
