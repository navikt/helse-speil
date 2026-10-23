import React, { HTMLAttributes, ReactElement, useState } from 'react';

import { HStack } from '@navikt/ds-react';

import {
    ApiArbeidsgiverinntekt,
    ApiBeregnetPeriode,
    ApiGhostPeriode,
    ApiSaksbildePerson,
    ApiVilkårsgrunnlagSpleisV2,
} from '@io/rest/generated/spesialist.schemas';
import { Inntekt } from '@saksbilde/sykepengegrunnlag/inntekt/Inntekt';
import { SykepengegrunnlagPanel } from '@saksbilde/sykepengegrunnlag/inntektsgrunnlagTable/SykepengegrunnlagPanel';
import { getActiveInntekt } from '@state/utils';

import styles from './SykepengegrunnlagFraSpleis.module.css';

interface SykepengegrunnlagFraSpleisProps extends HTMLAttributes<HTMLDivElement> {
    vilkårsgrunnlag: ApiVilkårsgrunnlagSpleisV2;
    organisasjonsnummer: string;
    person: ApiSaksbildePerson;
    periode: ApiBeregnetPeriode | ApiGhostPeriode;
}

export const SykepengegrunnlagFraSpleis = ({
    vilkårsgrunnlag,
    organisasjonsnummer,
    person,
    periode,
    ...rest
}: SykepengegrunnlagFraSpleisProps): ReactElement => {
    const [aktivInntektskilde, setAktivInntektskilde] = useState<ApiArbeidsgiverinntekt>(
        getActiveInntekt(vilkårsgrunnlag, organisasjonsnummer),
    );

    return (
        <HStack justify="start" wrap={false} {...rest}>
            <SykepengegrunnlagPanel
                vilkårsgrunnlagId={vilkårsgrunnlag.id}
                inntekter={vilkårsgrunnlag.inntekter}
                periode={periode}
                avviksvurdering={vilkårsgrunnlag.avviksvurdering ?? null}
                sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                setAktivInntektskilde={setAktivInntektskilde}
                aktivInntektskilde={aktivInntektskilde}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                skjønnsmessigFastsattÅrlig={vilkårsgrunnlag.skjonnsmessigFastsattAarlig}
                person={person}
                organisasjonsnummer={aktivInntektskilde.arbeidsgiver}
            />
            <span className={styles.strek} />
            <Inntekt person={person} inntekt={aktivInntektskilde} vilkårsgrunnlag={vilkårsgrunnlag} />
        </HStack>
    );
};
