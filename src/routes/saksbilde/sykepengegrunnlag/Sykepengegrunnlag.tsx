import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
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

type SykepengegrunnlagProps = {
    person: PersonFragment;
};

const SykepengegrunnlagContainer = ({ person }: SykepengegrunnlagProps): ReactElement | null => {
    const activePeriod = useActivePeriod();
    const vilkårsgrunnlag = useVilkårsgrunnlag(person, activePeriod);
    const vurdering = useVurderingForSkjæringstidspunkt((activePeriod as BeregnetPeriodeFragment).skjaeringstidspunkt);
    const arbeidsgiver = useCurrentArbeidsgiver();

    if (!(isBeregnetPeriode(activePeriod) || isGhostPeriode(activePeriod))) return null;
    if (!arbeidsgiver) return null;

    if (isSpleisVilkarsgrunnlag(vilkårsgrunnlag)) {
        return vurdering ? (
            <BehandletSykepengegrunnlag
                vurdering={vurdering}
                vilkårsgrunnlag={vilkårsgrunnlag}
                skjæringstidspunkt={activePeriod.skjaeringstidspunkt}
                arbeidsgiver={arbeidsgiver}
                person={person}
            />
        ) : (
            <SykepengegrunnlagFraSpleis
                vilkårsgrunnlag={vilkårsgrunnlag}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                data-testid="ubehandlet-sykepengegrunnlag"
                person={person}
            />
        );
    } else if (isInfotrygdVilkarsgrunnlag(vilkårsgrunnlag)) {
        return (
            <SykepengegrunnlagFraInfogtrygd
                person={person}
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

export const Sykepengegrunnlag = ({ person }: SykepengegrunnlagProps): ReactElement => {
    return (
        <ErrorBoundary fallback={<SykepengegrunnlagError />}>
            <SykepengegrunnlagContainer person={person} />
        </ErrorBoundary>
    );
};
