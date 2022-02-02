import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

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
    margin: 0 50px 0 2.5rem;
`;

const getInntekt = (
    vilkårsgrunnlag: ExternalVilkårsgrunnlag,
    organisasjonsnummer: string
): ExternalArbeidsgiverinntekt =>
    vilkårsgrunnlag.inntekter.find(
        (it) => it.organisasjonsnummer === organisasjonsnummer
    ) as ExternalArbeidsgiverinntekt;

interface UbehandletSykepengegrunnlagProps {
    vilkårsgrunnlag: ExternalSpleisVilkårsgrunnlag;
    organisasjonsnummer: string;
    'data-testid'?: string;
}

export const UbehandletSykepengegrunnlag = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
    ...rest
}: UbehandletSykepengegrunnlagProps) => {
    const inntekt = getInntekt(vilkårsgrunnlag, organisasjonsnummer);
    const [aktivInntektskilde, setAktivInntektskilde] = useState<ExternalArbeidsgiverinntekt>(inntekt);

    useEffect(() => {
        setAktivInntektskilde(inntekt);
    }, [inntekt]);

    useEffect(() => {
        setAktivInntektskilde(getInntekt(vilkårsgrunnlag, organisasjonsnummer));
    }, [vilkårsgrunnlag, organisasjonsnummer]);

    return (
        <Container data-testid={rest['data-testid'] ?? 'ubehandlet-sykepengegrunnlag'}>
            <InntektsgrunnlagTable
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={vilkårsgrunnlag.omregnetÅrsinntekt}
                sammenligningsgrunnlag={vilkårsgrunnlag.sammenligningsgrunnlag}
                avviksprosent={vilkårsgrunnlag.avviksprosent}
                sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                setAktivInntektskilde={setAktivInntektskilde}
                aktivInntektskilde={aktivInntektskilde}
            />
            <Strek />
            <Inntektskilderinnhold inntekt={aktivInntektskilde} />
        </Container>
    );
};
