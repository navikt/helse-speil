import React from 'react';

import { BeregnetPeriode } from '@io/graphql';

import { BehandletSykepengegrunnlag } from './BehandletSykepengegrunnlag';
import { SykepengegrunnlagFraInfogtrygd } from './SykepengegrunnlagFraInfotrygd';
import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periodState';
import { useCurrentPerson, useVilkårsgrunnlag } from '@state/personState';
import { useCurrentArbeidsgiver, useVurderingForSkjæringstidspunkt } from '@state/arbeidsgiverState';
import { isBeregnetPeriode, isInfotrygdVilkarsgrunnlag, isSpleisVilkarsgrunnlag } from '@utils/typeguards';
import { getInntektsgrunnlag } from '@state/selectors/person';

const SykepengegrunnlagContainer = () => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();
    const vilkårsgrunnlag = useVilkårsgrunnlag(
        (activePeriod as BeregnetPeriode).vilkarsgrunnlaghistorikkId,
        (activePeriod as BeregnetPeriode).skjaeringstidspunkt,
    );
    const vurdering = useVurderingForSkjæringstidspunkt((activePeriod as BeregnetPeriode).skjaeringstidspunkt);
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (isSpleisVilkarsgrunnlag(vilkårsgrunnlag) && isBeregnetPeriode(activePeriod) && arbeidsgiver && person) {
        const inntektsgrunnlag = getInntektsgrunnlag(person, activePeriod.skjaeringstidspunkt);

        return vurdering ? (
            <BehandletSykepengegrunnlag
                vurdering={vurdering}
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                refusjon={activePeriod.refusjon}
                skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                inntektsgrunnlag={inntektsgrunnlag}
            />
        ) : (
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                refusjon={activePeriod.refusjon}
                inntektsgrunnlag={inntektsgrunnlag}
                data-testid="ubehandlet-sykepengegrunnlag"
            />
        );
    } else if (isInfotrygdVilkarsgrunnlag(vilkårsgrunnlag) && arbeidsgiver && person) {
        return (
            <SykepengegrunnlagFraInfogtrygd
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
            />
        );
    }

    return null;
};

const SykepengegrunnlagSkeleton = () => {
    return <div />;
};

const SykepengegrunnlagError = () => {
    return <div />;
};

export const Sykepengegrunnlag = () => {
    return (
        <React.Suspense fallback={<SykepengegrunnlagSkeleton />}>
            <ErrorBoundary fallback={<SykepengegrunnlagError />}>
                <SykepengegrunnlagContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};
