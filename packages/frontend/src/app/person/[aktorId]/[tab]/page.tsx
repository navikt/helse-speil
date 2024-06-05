'use client';

import React, { ReactElement } from 'react';

import { SaksbildeMenu } from '@/routes/saksbilde/saksbildeMenu/SaksbildeMenu';
import { AnnullertPeriodeView } from '@/routes/saksbilde/saksbilder/AnnullertPeriodeView';
import BeregnetPeriodeView from '@/routes/saksbilde/saksbilder/BeregnetPeriodeView';
import GhostPeriodeView from '@/routes/saksbilde/saksbilder/GhostPeriodeView';
import { PeriodeTilAnnulleringView } from '@/routes/saksbilde/saksbilder/PeriodeTilAnnulleringView';
import UberegnetPeriodeView from '@/routes/saksbilde/saksbilder/UberegnetPeriodeView';
import { Periodetilstand } from '@io/graphql';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

function Page(): ReactElement | null {
    const activePeriod = useActivePeriod();
    const currentPerson = useCurrentPerson();

    if (!activePeriod || !currentPerson) {
        return <SaksbildeMenu />;
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
