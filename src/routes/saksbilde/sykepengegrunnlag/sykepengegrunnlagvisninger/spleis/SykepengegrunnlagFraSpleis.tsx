import React, { HTMLAttributes, ReactElement, useEffect, useState } from 'react';

import { HStack } from '@navikt/ds-react';

import { Arbeidsgiverinntekt, PersonFragment, VilkarsgrunnlagSpleis } from '@io/graphql';
import { Inntekt } from '@saksbilde/sykepengegrunnlag/inntekt/Inntekt';
import { SykepengegrunnlagPanel } from '@saksbilde/sykepengegrunnlag/inntektsgrunnlagTable/SykepengegrunnlagPanel';
import { useArbeidsgiver } from '@state/arbeidsgiver';
import { getRequiredInntekt } from '@state/utils';

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
}: SykepengegrunnlagFraSpleisProps): ReactElement => {
    const inntekt = getRequiredInntekt(vilkårsgrunnlag, organisasjonsnummer);
    const [aktivInntektskilde, setAktivInntektskilde] = useState<Arbeidsgiverinntekt>(inntekt);
    const aktivArbeidsgiver = useArbeidsgiver(person, aktivInntektskilde.arbeidsgiver);

    useEffect(() => {
        setAktivInntektskilde(inntekt);
    }, [inntekt]);

    useEffect(() => {
        if (aktivArbeidsgiver) {
            setAktivInntektskilde(getRequiredInntekt(vilkårsgrunnlag, aktivArbeidsgiver.organisasjonsnummer));
        }
    }, [vilkårsgrunnlag, aktivArbeidsgiver]);

    return (
        <HStack justify="start" wrap={false} {...rest}>
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
            <Inntekt person={person} inntekt={aktivInntektskilde} />
        </HStack>
    );
};
