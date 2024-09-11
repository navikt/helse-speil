'use client';

import React, { ReactElement } from 'react';

import { Maybe, Periodetilstand } from '@io/graphql';
import { AnnullertPeriodeView } from '@saksbilde/saksbilder/AnnullertPeriodeView';
import { BeregnetPeriodeView } from '@saksbilde/saksbilder/BeregnetPeriodeView';
import { GhostPeriodeView } from '@saksbilde/saksbilder/GhostPeriodeView';
import { NyttInntektsforholdPeriodeView } from '@saksbilde/saksbilder/NyttInntektsforholdPeriodeView';
import { PeriodeTilAnnulleringView } from '@saksbilde/saksbilder/PeriodeTilAnnulleringView';
import { PeriodeViewError } from '@saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@saksbilde/saksbilder/PeriodeViewSkeleton';
import { UberegnetPeriodeView } from '@saksbilde/saksbilder/UberegnetPeriodeView';
import { useActivePeriodOld } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { isBeregnetPeriode, isGhostPeriode, isTilkommenInntekt, isUberegnetPeriode } from '@utils/typeguards';

export function PeriodeView(): Maybe<ReactElement> {
    const activePeriod = useActivePeriodOld();
    // TODO: legg til rette for error
    const { loading, data } = useFetchPersonQuery();

    if (loading) {
        return <PeriodeViewSkeleton />;
    }

    if (!activePeriod || !data?.person) {
        return <PeriodeViewError />;
    }
    if (isBeregnetPeriode(activePeriod)) {
        switch (activePeriod.periodetilstand) {
            case Periodetilstand.Annullert:
                return <AnnullertPeriodeView activePeriod={activePeriod} person={data.person} />;
            case Periodetilstand.TilAnnullering:
                return <PeriodeTilAnnulleringView activePeriod={activePeriod} person={data.person} />;
            default:
                return <BeregnetPeriodeView period={activePeriod} person={data.person} />;
        }
    } else if (isGhostPeriode(activePeriod)) {
        return <GhostPeriodeView activePeriod={activePeriod} person={data.person} />;
    } else if (isTilkommenInntekt(activePeriod)) {
        return <NyttInntektsforholdPeriodeView activePeriod={activePeriod} person={data.person} />;
    } else if (isUberegnetPeriode(activePeriod)) {
        return <UberegnetPeriodeView activePeriod={activePeriod} person={data.person} />;
    } else {
        return null;
    }
}
