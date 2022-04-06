import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

import { InntektsgrunnlagTable } from './InntektsgrunnlagTable';
import { Inntektskilderinnhold } from './Inntektskilderinnhold';
import {
    Arbeidsforhold,
    Arbeidsgiver,
    Arbeidsgiverinntekt,
    Inntektsgrunnlag,
    Refusjon,
    VilkarsgrunnlagSpleis,
} from '@io/graphql';
import { getInntekt } from '@state/selectors/person';

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

interface SykepengegrunnlagFraSpleisProps extends HTMLAttributes<HTMLDivElement> {
    vilkårsgrunnlag: VilkarsgrunnlagSpleis;
    inntektsgrunnlag: Inntektsgrunnlag;
    skjæringstidspunkt: DateString;
    arbeidsgiver: Omit<Arbeidsgiver, 'generasjoner' | 'ghostPerioder' | 'overstyringer'>;
    refusjon?: Refusjon | null;
}

export const SykepengegrunnlagFraSpleis = ({
    vilkårsgrunnlag,
    inntektsgrunnlag,
    skjæringstidspunkt,
    arbeidsgiver,
    refusjon,
    ...rest
}: SykepengegrunnlagFraSpleisProps) => {
    const inntekt = getInntekt(vilkårsgrunnlag, arbeidsgiver.organisasjonsnummer);

    const [aktivInntektskilde, setAktivInntektskilde] = useState<Arbeidsgiverinntekt>(inntekt);

    useEffect(() => {
        setAktivInntektskilde(inntekt);
    }, [inntekt]);

    useEffect(() => {
        setAktivInntektskilde(getInntekt(vilkårsgrunnlag, arbeidsgiver.organisasjonsnummer));
    }, [vilkårsgrunnlag, arbeidsgiver.organisasjonsnummer]);

    return (
        <Container {...rest}>
            <InntektsgrunnlagTable
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={vilkårsgrunnlag.omregnetArsinntekt}
                sammenligningsgrunnlag={vilkårsgrunnlag.sammenligningsgrunnlag}
                avviksprosent={inntektsgrunnlag.avviksprosent}
                sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                setAktivInntektskilde={setAktivInntektskilde}
                aktivInntektskilde={aktivInntektskilde}
            />
            <Strek />
            <Inntektskilderinnhold
                inntekt={aktivInntektskilde}
                refusjon={refusjon}
                arbeidsgivernavn={arbeidsgiver.navn}
                bransjer={arbeidsgiver.bransjer}
                arbeidsforhold={arbeidsgiver.arbeidsforhold}
                skjæringstidspunkt={skjæringstidspunkt}
            />
        </Container>
    );
};
