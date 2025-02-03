import React, { HTMLAttributes, ReactElement, useEffect, useState } from 'react';

import { HStack } from '@navikt/ds-react';

import {
    Arbeidsgiverinntekt,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    PersonFragment,
    VilkarsgrunnlagSpleis,
} from '@io/graphql';
import { Inntekt } from '@saksbilde/sykepengegrunnlag/inntekt/Inntekt';
import { SykepengegrunnlagPanel } from '@saksbilde/sykepengegrunnlag/inntektsgrunnlagTable/SykepengegrunnlagPanel';
import { getRequiredInntekt } from '@state/utils';

import styles from './SykepengegrunnlagFraSpleis.module.css';

interface SykepengegrunnlagFraSpleisProps extends HTMLAttributes<HTMLDivElement> {
    vilkårsgrunnlag: VilkarsgrunnlagSpleis;
    organisasjonsnummer: string;
    person: PersonFragment;
    periode: BeregnetPeriodeFragment | GhostPeriodeFragment;
}

export const SykepengegrunnlagFraSpleis = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
    person,
    periode,
    ...rest
}: SykepengegrunnlagFraSpleisProps): ReactElement => {
    const inntekt = getRequiredInntekt(vilkårsgrunnlag, organisasjonsnummer);
    const [aktivInntektskilde, setAktivInntektskilde] = useState<Arbeidsgiverinntekt>(inntekt);

    useEffect(() => {
        setAktivInntektskilde(inntekt);
    }, [inntekt]);

    // useEffect(() => {
    //     if (aktivArbeidsgiverOrgnummer) {
    //         setAktivInntektskilde(getRequiredInntekt(vilkårsgrunnlag, aktivArbeidsgiverOrgnummer));
    //     }
    // }, [vilkårsgrunnlag, aktivArbeidsgiverOrgnummer]);

    return (
        <HStack justify="start" wrap={false} {...rest}>
            <SykepengegrunnlagPanel
                inntekter={vilkårsgrunnlag.inntekter}
                periode={periode}
                omregnetÅrsinntekt={vilkårsgrunnlag.omregnetArsinntekt}
                sammenligningsgrunnlag={vilkårsgrunnlag.sammenligningsgrunnlag}
                avviksprosent={vilkårsgrunnlag.avviksprosent}
                sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                setAktivInntektskilde={setAktivInntektskilde}
                aktivInntektskilde={aktivInntektskilde}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                skjønnsmessigFastsattÅrlig={vilkårsgrunnlag.skjonnsmessigFastsattAarlig}
                person={person}
                organisasjonsnummer={aktivInntektskilde.arbeidsgiver}
            />
            <span className={styles.strek} />
            <Inntekt person={person} inntekt={aktivInntektskilde} />
        </HStack>
    );
};
