import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

import { Arbeidsgiver, Arbeidsgiverinntekt, Arbeidsgiverrefusjon, VilkarsgrunnlagSpleis } from '@io/graphql';
import { useArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { getRequiredInntekt } from '@state/selectors/person';
import { isBeregnetPeriode } from '@utils/typeguards';

import { InntektsgrunnlagTable } from './InntektsgrunnlagTable';
import { Inntektskilderinnhold } from './Inntektskilderinnhold';

const Container = styled.div`
    display: flex;
    align-content: space-between;
    margin-top: -2rem;
`;

const Strek = styled.span`
    border-right: 3px solid var(--navds-global-color-gray-200);
    height: inherit;
    display: inline-block;
`;

const useSkalViseRefusjon = (refusjon?: Maybe<Arbeidsgiverrefusjon>, arbeidsgiver?: Maybe<Arbeidsgiver>): boolean => {
    const aktivPeriode = useActivePeriod();

    if (!isBeregnetPeriode(aktivPeriode) || !refusjon || !arbeidsgiver) {
        return false;
    }

    return (
        arbeidsgiver.generasjoner.find((gen) =>
            gen.perioder.find((periode) => isBeregnetPeriode(periode) && periode.id === aktivPeriode.id)
        ) !== undefined
    );
};

interface SykepengegrunnlagFraSpleisProps extends HTMLAttributes<HTMLDivElement> {
    vilkårsgrunnlag: VilkarsgrunnlagSpleis;
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
    refusjon?: Maybe<Arbeidsgiverrefusjon>;
}

export const SykepengegrunnlagFraSpleis = ({
    vilkårsgrunnlag,
    skjæringstidspunkt,
    organisasjonsnummer,
    refusjon,
    ...rest
}: SykepengegrunnlagFraSpleisProps) => {
    const inntekt = getRequiredInntekt(vilkårsgrunnlag, organisasjonsnummer);

    const [aktivInntektskilde, setAktivInntektskilde] = useState<Arbeidsgiverinntekt>(inntekt);

    const aktivArbeidsgiver = useArbeidsgiver(aktivInntektskilde.arbeidsgiver);

    const skalViseRefusjon = useSkalViseRefusjon(refusjon, aktivArbeidsgiver);

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
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
            />
            <Strek />
            <Inntektskilderinnhold inntekt={aktivInntektskilde} refusjon={skalViseRefusjon ? refusjon : null} />
        </Container>
    );
};
