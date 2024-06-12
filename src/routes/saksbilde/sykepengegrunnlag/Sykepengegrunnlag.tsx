import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { BeregnetPeriodeFragment } from '@io/graphql';
import { useCurrentPerson } from '@person/query';
import { useCurrentArbeidsgiver, useVurderingForSkjæringstidspunkt } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import {
    isBeregnetPeriode,
    isGhostPeriode,
    isInfotrygdVilkarsgrunnlag,
    isSpleisVilkarsgrunnlag,
} from '@utils/typeguards';

import { BehandletSykepengegrunnlag } from './sykepengegrunnlagvisninger/BehandletSykepengegrunnlag';
import { SykepengegrunnlagFraInfogtrygd } from './sykepengegrunnlagvisninger/infotrygd/SykepengegrunnlagFraInfotrygd';
import { SykepengegrunnlagFraSpleis } from './sykepengegrunnlagvisninger/spleis/SykepengegrunnlagFraSpleis';
import { useVilkårsgrunnlag } from './useVilkårsgrunnlag';

const SykepengegrunnlagContainer = (): ReactElement | null => {
    const person = useCurrentPerson();
    const activePeriod = useActivePeriod();
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, activePeriod);
    const vurdering = useVurderingForSkjæringstidspunkt((activePeriod as BeregnetPeriodeFragment).skjaeringstidspunkt);
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

const SykepengegrunnlagError = (): ReactElement => {
    return (
        <Alert variant="error" size="small">
            Noe gikk galt. Kan ikke vise sykepengegrunnlag for denne perioden.
        </Alert>
    );
};

export const Sykepengegrunnlag = (): ReactElement => {
    return (
        <ErrorBoundary fallback={<SykepengegrunnlagError />}>
            <SykepengegrunnlagContainer />
        </ErrorBoundary>
    );
};

export default Sykepengegrunnlag;
