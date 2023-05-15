import React from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { BeregnetPeriode, Vilkarsgrunnlag } from '@io/graphql';
import { useCurrentArbeidsgiver, useVurderingForSkjæringstidspunkt } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { getRequiredVilkårsgrunnlag } from '@state/selectors/person';
import {
    isBeregnetPeriode,
    isGhostPeriode,
    isInfotrygdVilkarsgrunnlag,
    isSpleisVilkarsgrunnlag,
} from '@utils/typeguards';

import { BehandletSykepengegrunnlag } from './BehandletSykepengegrunnlag';
import { SykepengegrunnlagFraInfogtrygd } from './SykepengegrunnlagFraInfotrygd';
import { SykepengegrunnlagFraSpleis } from './SykepengegrunnlagFraSpleis';

export const useVilkårsgrunnlag = (
    person?: Maybe<FetchedPerson>,
    period?: Maybe<ActivePeriod>,
): Maybe<Vilkarsgrunnlag> => {
    if (!person || (!isGhostPeriode(period) && !isBeregnetPeriode(period)) || !period.vilkarsgrunnlagId) {
        return null;
    }

    return getRequiredVilkårsgrunnlag(person, period.vilkarsgrunnlagId);
};

const SykepengegrunnlagContainer: React.FC = () => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, activePeriod);
    const vurdering = useVurderingForSkjæringstidspunkt((activePeriod as BeregnetPeriode).skjaeringstidspunkt);
    const arbeidsgiver = useCurrentArbeidsgiver();

    if ((isGhostPeriode(activePeriod) || isBeregnetPeriode(activePeriod)) && arbeidsgiver && person) {
        if (isSpleisVilkarsgrunnlag(vilkårsgrunnlag)) {
            return vurdering ? (
                <BehandletSykepengegrunnlag
                    vurdering={vurdering}
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                    arbeidsgiver={arbeidsgiver}
                />
            ) : (
                <SykepengegrunnlagFraSpleis
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                    organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                    data-testid="ubehandlet-sykepengegrunnlag"
                />
            );
        } else if (isInfotrygdVilkarsgrunnlag(vilkårsgrunnlag)) {
            return (
                <SykepengegrunnlagFraInfogtrygd
                    vilkårsgrunnlag={vilkårsgrunnlag}
                    organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
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
    return (
        <Alert variant="error" size="small">
            Noe gikk galt. Kan ikke vise sykepengegrunnlag for denne perioden.
        </Alert>
    );
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
