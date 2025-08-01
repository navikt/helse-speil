'use client';

import { ReactElement } from 'react';

import { Periodetilstand } from '@io/graphql';
import { BeregnetPeriodeView } from '@saksbilde/saksbilder/BeregnetPeriodeView';
import { GhostPeriodeView } from '@saksbilde/saksbilder/GhostPeriodeView';
import { UberegnetPeriodeView } from '@saksbilde/saksbilder/UberegnetPeriodeView';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

export function PeriodeView(): ReactElement | null {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const activePeriod = useActivePeriod(person);

    if (!activePeriod || !person) {
        return null;
    }

    if (
        isBeregnetPeriode(activePeriod) &&
        activePeriod.periodetilstand !== Periodetilstand.Annullert &&
        activePeriod.periodetilstand !== Periodetilstand.TilAnnullering
    ) {
        return <BeregnetPeriodeView period={activePeriod} person={person} />;
    } else if (isGhostPeriode(activePeriod)) {
        return <GhostPeriodeView activePeriod={activePeriod} person={person} />;
    } else if (isUberegnetPeriode(activePeriod)) {
        return <UberegnetPeriodeView activePeriod={activePeriod} person={person} />;
    } else {
        return null;
    }
}
