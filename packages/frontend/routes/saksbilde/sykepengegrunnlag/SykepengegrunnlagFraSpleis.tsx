import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

import { InntektsgrunnlagTable } from './InntektsgrunnlagTable';
import { Inntektskilderinnhold } from './Inntektskilderinnhold';
import { Arbeidsgiverinntekt, Refusjon, VilkarsgrunnlagSpleis } from '@io/graphql';
import { getInntekt } from '@state/selectors/person';
import { useArbeidsgiver } from '@state/arbeidsgiver';

const Container = styled.div`
    display: flex;
    margin-top: 1rem;
    align-content: space-between;
`;

const Strek = styled.span`
    border-right: 1px solid var(--navds-semantic-color-border);
    height: inherit;
    display: inline-block;
    margin: 0 50px 0 2.5rem;
`;

interface SykepengegrunnlagFraSpleisProps extends HTMLAttributes<HTMLDivElement> {
    vilkårsgrunnlag: VilkarsgrunnlagSpleis;
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
    refusjon?: Refusjon | null;
}

export const SykepengegrunnlagFraSpleis = ({
    vilkårsgrunnlag,
    skjæringstidspunkt,
    organisasjonsnummer,
    refusjon,
    ...rest
}: SykepengegrunnlagFraSpleisProps) => {
    const inntekt = getInntekt(vilkårsgrunnlag, organisasjonsnummer);

    const [aktivInntektskilde, setAktivInntektskilde] = useState<Arbeidsgiverinntekt>(inntekt);

    const aktivArbeidsgiver = useArbeidsgiver(aktivInntektskilde.arbeidsgiver);

    useEffect(() => {
        setAktivInntektskilde(inntekt);
    }, [inntekt]);

    useEffect(() => {
        if (aktivArbeidsgiver) {
            setAktivInntektskilde(getInntekt(vilkårsgrunnlag, aktivArbeidsgiver.organisasjonsnummer));
        }
    }, [vilkårsgrunnlag, aktivArbeidsgiver]);

    if (!aktivArbeidsgiver) {
        return null;
    }

    return (
        <Container {...rest}>
            <InntektsgrunnlagTable
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={vilkårsgrunnlag.omregnetArsinntekt}
                sammenligningsgrunnlag={vilkårsgrunnlag.sammenligningsgrunnlag}
                avviksprosent={vilkårsgrunnlag.avviksprosent}
                sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                setAktivInntektskilde={setAktivInntektskilde}
                aktivInntektskilde={aktivInntektskilde}
            />
            <Strek />
            <Inntektskilderinnhold
                inntekt={aktivInntektskilde}
                arbeidsgivernavn={aktivArbeidsgiver.navn}
                bransjer={aktivArbeidsgiver.bransjer}
                arbeidsforhold={aktivArbeidsgiver.arbeidsforhold}
                skjæringstidspunkt={skjæringstidspunkt}
                refusjon={refusjon}
            />
        </Container>
    );
};
