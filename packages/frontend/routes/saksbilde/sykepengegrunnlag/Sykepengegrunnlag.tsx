import { useVilkårsgrunnlag } from './useVilkårsgrunnlag';
import React from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { BeregnetPeriode } from '@io/graphql';
import { useCurrentArbeidsgiver, useVurderingForSkjæringstidspunkt } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import {
    isBeregnetPeriode,
    isGhostPeriode,
    isInfotrygdVilkarsgrunnlag,
    isSpleisVilkarsgrunnlag,
} from '@utils/typeguards';

import { BehandletSykepengegrunnlag } from './sykepengegrunnlagvisninger/BehandletSykepengegrunnlag';
import { SykepengegrunnlagFraInfogtrygd } from './sykepengegrunnlagvisninger/infotrygd/SykepengegrunnlagFraInfotrygd';
import { SykepengegrunnlagFraSpleis } from './sykepengegrunnlagvisninger/spleis/SykepengegrunnlagFraSpleis';

const SykepengegrunnlagContainer: React.FC = () => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, activePeriod);
    const vurdering = useVurderingForSkjæringstidspunkt((activePeriod as BeregnetPeriode).skjaeringstidspunkt);
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!((isGhostPeriode(activePeriod) || isBeregnetPeriode(activePeriod)) && arbeidsgiver && person)) return null;

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
