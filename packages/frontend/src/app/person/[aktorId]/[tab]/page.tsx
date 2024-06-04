'use client';

import React, { ReactElement } from 'react';

import { AnnullertPeriodeView } from '@/routes/saksbilde/saksbilder/AnnullertPeriodeView';
import { PeriodeTilAnnulleringView } from '@/routes/saksbilde/saksbilder/PeriodeTilAnnulleringView';
import { BeregnetPeriodeView, GhostPeriodeView, UberegnetPeriodeView } from '@/routes/saksbilde/saksbilder/PeriodeView';
import { Periodetilstand } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import Loading from './loading';

function Page(): ReactElement | null {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();

    if (!activePeriod || !currentPerson) {
        return <Loading />;
    } else if (isBeregnetPeriode(activePeriod)) {
        switch (activePeriod.periodetilstand) {
            case Periodetilstand.Annullert:
                return <AnnullertPeriodeView />;
            case Periodetilstand.TilAnnullering:
                return <PeriodeTilAnnulleringView />;
            default:
                return <BeregnetPeriodeView period={activePeriod} person={currentPerson} />;
        }
    } else if (isGhostPeriode(activePeriod)) {
        return <GhostPeriodeView activePeriod={activePeriod} />;
    } else if (isUberegnetPeriode(activePeriod)) {
        return <UberegnetPeriodeView activePeriod={activePeriod} />;
    } else {
        return null;
    }
}

export default Page;
