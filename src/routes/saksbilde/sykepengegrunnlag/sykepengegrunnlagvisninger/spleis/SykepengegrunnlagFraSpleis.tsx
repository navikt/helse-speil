import React, { HTMLAttributes, useEffect, useState } from 'react';

import { Arbeidsgiverinntekt, PersonFragment, VilkarsgrunnlagSpleis } from '@io/graphql';
import { getRequiredInntekt } from '@person/utils';
import { Inntekt } from '@saksbilde/sykepengegrunnlag/inntekt/Inntekt';
import { InntektUtenOmregnetÅrsinntekt } from '@saksbilde/sykepengegrunnlag/inntekt/InntektUtenOmregnetÅrsinntekt';
import { SykepengegrunnlagPanel } from '@saksbilde/sykepengegrunnlag/inntektsgrunnlagTable/SykepengegrunnlagPanel';
import { useArbeidsgiver } from '@state/arbeidsgiver';

import styles from './SykepengegrunnlagFraSpleis.module.css';

interface SykepengegrunnlagFraSpleisProps extends HTMLAttributes<HTMLDivElement> {
    vilkårsgrunnlag: VilkarsgrunnlagSpleis;
    organisasjonsnummer: string;
    person: PersonFragment;
}

export const SykepengegrunnlagFraSpleis = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
    person,
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

    return (
        <div className={styles.container} {...rest}>
            <SykepengegrunnlagPanel
                inntekter={vilkårsgrunnlag.inntekter}
                omregnetÅrsinntekt={vilkårsgrunnlag.omregnetArsinntekt}
                sammenligningsgrunnlag={vilkårsgrunnlag.sammenligningsgrunnlag}
                avviksprosent={vilkårsgrunnlag.avviksprosent}
                sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                setAktivInntektskilde={setAktivInntektskilde}
                aktivInntektskilde={aktivInntektskilde}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                skjønnsmessigFastsattÅrlig={vilkårsgrunnlag.skjonnsmessigFastsattAarlig}
                person={person}
            />
            <span className={styles.strek} />
            {aktivInntektskilde.omregnetArsinntekt !== null ? (
                <Inntekt person={person} inntekt={aktivInntektskilde} />
            ) : (
                <InntektUtenOmregnetÅrsinntekt inntekt={aktivInntektskilde} />
            )}
        </div>
    );
};
