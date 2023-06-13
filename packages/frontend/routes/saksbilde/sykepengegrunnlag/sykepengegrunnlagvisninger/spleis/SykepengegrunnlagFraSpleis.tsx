import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

import { Arbeidsgiverinntekt, Inntektskilde, VilkarsgrunnlagSpleis } from '@io/graphql';
import { useArbeidsgiver } from '@state/arbeidsgiver';
import { getRequiredInntekt } from '@state/selectors/person';

import { SykepengegrunnlagPanel } from '../../InntektsgrunnlagTable/SykepengegrunnlagPanel';
import { Inntekt } from '../../inntekt/Inntekt';

const Container = styled.div`
    display: flex;
    align-content: space-between;
    margin-top: -2rem;
`;

const Strek = styled.span`
    border-right: 3px solid var(--a-gray-200);
    height: inherit;
    display: inline-block;
`;

interface SykepengegrunnlagFraSpleisProps extends HTMLAttributes<HTMLDivElement> {
    vilkårsgrunnlag: VilkarsgrunnlagSpleis;
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
}

export const SykepengegrunnlagFraSpleis = ({
    vilkårsgrunnlag,
    skjæringstidspunkt,
    organisasjonsnummer,
    ...rest
}: SykepengegrunnlagFraSpleisProps) => {
    const inntekt = getRequiredInntekt(vilkårsgrunnlag, organisasjonsnummer);

    const [aktivInntektskilde, setAktivInntektskilde] = useState<Arbeidsgiverinntekt>(inntekt);

    const aktivArbeidsgiver = useArbeidsgiver(aktivInntektskilde.arbeidsgiver);

    useEffect(() => {
        setAktivInntektskilde(inntekt);
    }, [inntekt]);

    useEffect(() => {
        if (aktivArbeidsgiver) {
            setAktivInntektskilde(getRequiredInntekt(vilkårsgrunnlag, aktivArbeidsgiver.organisasjonsnummer));
        }
    }, [vilkårsgrunnlag, aktivArbeidsgiver]);

    if (!aktivArbeidsgiver) {
        return null;
    }

    const skjønnsmessigFastsattInntekt: number | undefined = vilkårsgrunnlag.inntekter.reduce(
        (previousValue: number | undefined, currentValue) => {
            if (currentValue.omregnetArsinntekt?.kilde === Inntektskilde.SkjonnsmessigFastsatt) {
                return currentValue.omregnetArsinntekt?.belop + (previousValue ?? 0);
            }
            return previousValue;
        },
        undefined,
    );

    return (
        <Container {...rest}>
            <SykepengegrunnlagPanel
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={vilkårsgrunnlag.omregnetArsinntekt}
                sammenligningsgrunnlag={vilkårsgrunnlag.sammenligningsgrunnlag}
                avviksprosent={vilkårsgrunnlag.avviksprosent}
                sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                setAktivInntektskilde={setAktivInntektskilde}
                aktivInntektskilde={aktivInntektskilde}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                skjønnsmessigFastsattInntekt={skjønnsmessigFastsattInntekt}
            />
            <Strek />
            <Inntekt inntekt={aktivInntektskilde} />
        </Container>
    );
};
