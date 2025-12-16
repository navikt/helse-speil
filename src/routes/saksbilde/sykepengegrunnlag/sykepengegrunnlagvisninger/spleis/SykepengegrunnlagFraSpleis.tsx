import React, { HTMLAttributes, ReactElement, useEffect, useState } from 'react';

import { HStack } from '@navikt/ds-react';

import {
    Arbeidsgiverinntekt,
    BeregnetPeriodeFragment,
    GhostPeriodeFragment,
    PersonFragment,
    VilkarsgrunnlagSpleisV2,
} from '@io/graphql';
import { Inntekt } from '@saksbilde/sykepengegrunnlag/inntekt/Inntekt';
import { SykepengegrunnlagPanel } from '@saksbilde/sykepengegrunnlag/inntektsgrunnlagTable/SykepengegrunnlagPanel';
import { getActiveInntekt } from '@state/utils';

import styles from './SykepengegrunnlagFraSpleis.module.css';

interface SykepengegrunnlagFraSpleisProps extends HTMLAttributes<HTMLDivElement> {
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2;
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
    const inntekt = getActiveInntekt(vilkårsgrunnlag, organisasjonsnummer);
    const [aktivInntektskilde, setAktivInntektskilde] = useState<Arbeidsgiverinntekt>(inntekt);

    useEffect(() => {
        setAktivInntektskilde(inntekt);
    }, [inntekt]);

    return (
        <HStack justify="start" wrap={false} {...rest}>
            <SykepengegrunnlagPanel
                inntekter={vilkårsgrunnlag.inntekter}
                periode={periode}
                avviksvurdering={vilkårsgrunnlag.avviksvurdering}
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
