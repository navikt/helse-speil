'use client';

import React, { ReactElement } from 'react';

import { AnnullertPeriodeView } from '@/routes/saksbilde/saksbilder/AnnullertPeriodeView';
import { BeregnetPeriodeView } from '@/routes/saksbilde/saksbilder/BeregnetPeriodeView';
import { GhostPeriodeView } from '@/routes/saksbilde/saksbilder/GhostPeriodeView';
import { PeriodeTilAnnulleringView } from '@/routes/saksbilde/saksbilder/PeriodeTilAnnulleringView';
import { PeriodeViewError } from '@/routes/saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@/routes/saksbilde/saksbilder/PeriodeViewSkeleton';
import { UberegnetPeriodeView } from '@/routes/saksbilde/saksbilder/UberegnetPeriodeView';
import { Periodetilstand } from '@io/graphql';
import { useFetchPersonQuery } from '@person/query';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

function PeriodeView(): ReactElement | null {
    const activePeriod = useActivePeriod();
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
                return <AnnullertPeriodeView activePeriod={activePeriod} />;
            case Periodetilstand.TilAnnullering:
                return <PeriodeTilAnnulleringView activePeriod={activePeriod} />;
            default:
                return <BeregnetPeriodeView period={activePeriod} person={data.person} />;
        }
    } else if (isGhostPeriode(activePeriod)) {
        return <GhostPeriodeView activePeriod={activePeriod} person={data.person} />;
    } else if (isUberegnetPeriode(activePeriod)) {
        return <UberegnetPeriodeView activePeriod={activePeriod} />;
    } else {
        return null;
    }
}

export default PeriodeView;
