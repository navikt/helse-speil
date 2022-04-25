import React from 'react';

import { BeregnetPeriode } from '@io/graphql';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periode';
import { getInntektsgrunnlag } from '@state/selectors/person';
import { useCurrentPerson, useVilkårsgrunnlag } from '@state/person';
import { useCurrentArbeidsgiver, useVurderingForSkjæringstidspunkt } from '@state/arbeidsgiver';
import {
    isBeregnetPeriode,
    isGhostPeriode,
    isInfotrygdVilkarsgrunnlag,
    isSpleisVilkarsgrunnlag,
} from '@utils/typeguards';

import { BehandletSykepengegrunnlag } from './BehandletSykepengegrunnlag';
import { SykepengegrunnlagFraInfogtrygd } from './SykepengegrunnlagFraInfotrygd';
import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

const SykepengegrunnlagContainer = () => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();
    const vilkårsgrunnlag = useVilkårsgrunnlag(
        (activePeriod as BeregnetPeriode).vilkarsgrunnlaghistorikkId,
        (activePeriod as BeregnetPeriode).skjaeringstidspunkt,
    );
    const vurdering = useVurderingForSkjæringstidspunkt((activePeriod as BeregnetPeriode).skjaeringstidspunkt);
    const arbeidsgiver = useCurrentArbeidsgiver();

    if ((isGhostPeriode(activePeriod) || isBeregnetPeriode(activePeriod)) && arbeidsgiver && person) {
        if (isSpleisVilkarsgrunnlag(vilkårsgrunnlag)) {
            const inntektsgrunnlag = getInntektsgrunnlag(person, activePeriod.skjaeringstidspunkt);

            return vurdering ? (
                <BehandletSykepengegrunnlag
                    vurdering={vurdering}
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    refusjon={isBeregnetPeriode(activePeriod) ? activePeriod.refusjon : null}
                    skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                    inntektsgrunnlag={inntektsgrunnlag}
                    arbeidsgiver={arbeidsgiver}
                />
            ) : (
                <SykepengegrunnlagFraSpleis
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    inntektsgrunnlag={inntektsgrunnlag}
                    skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                    organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                    refusjon={isBeregnetPeriode(activePeriod) ? activePeriod.refusjon : null}
                    data-testid="ubehandlet-sykepengegrunnlag"
                />
            );
        } else if (isInfotrygdVilkarsgrunnlag(vilkårsgrunnlag)) {
            return (
                <SykepengegrunnlagFraInfogtrygd
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                    refusjon={isBeregnetPeriode(activePeriod) ? activePeriod.refusjon : null}
                    arbeidsgivernavn={arbeidsgiver.navn}
                    bransjer={arbeidsgiver.bransjer}
                    arbeidsforhold={arbeidsgiver.arbeidsforhold}
                    skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                />
            );
        }
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

export default Sykepengegrunnlag;
