'use client';

import React, { ReactElement } from 'react';

import { Maybe, Periodetilstand } from '@io/graphql';
import { BeregnetPeriodeView } from '@saksbilde/saksbilder/BeregnetPeriodeView';
import { GhostPeriodeView } from '@saksbilde/saksbilder/GhostPeriodeView';
import { NyttInntektsforholdPeriodeView } from '@saksbilde/saksbilder/NyttInntektsforholdPeriodeView';
import { UberegnetPeriodeView } from '@saksbilde/saksbilder/UberegnetPeriodeView';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { isBeregnetPeriode, isGhostPeriode, isTilkommenInntekt, isUberegnetPeriode } from '@utils/typeguards';

export function PeriodeView(): Maybe<ReactElement> {
    const { data } = useFetchPersonQuery();
    const { data: tilkommenInntektData } = useHentTilkommenInntektQuery();

    const person = data?.person ?? null;
    const tilkommeneInntektskilder = tilkommenInntektData?.tilkomneInntektskilder ?? [];
    const activePeriod = useActivePeriod(person);

    if (!activePeriod || !person) {
        return null;
    }

    if (
        isBeregnetPeriode(activePeriod) &&
        activePeriod.periodetilstand !== Periodetilstand.Annullert &&
        activePeriod.periodetilstand !== Periodetilstand.TilAnnullering
    ) {
        return (
            <BeregnetPeriodeView
                period={activePeriod}
                person={person}
                tilkommeneInntektskilder={tilkommeneInntektskilder}
            />
        );
    } else if (isGhostPeriode(activePeriod)) {
        return (
            <GhostPeriodeView
                activePeriod={activePeriod}
                person={person}
                tilkommeneInntektskilder={tilkommeneInntektskilder}
            />
        );
    } else if (isTilkommenInntekt(activePeriod)) {
        return (
            <NyttInntektsforholdPeriodeView
                activePeriod={activePeriod}
                person={person}
                tilkommeneInntektskilder={tilkommeneInntektskilder}
            />
        );
    } else if (isUberegnetPeriode(activePeriod)) {
        return (
            <UberegnetPeriodeView
                activePeriod={activePeriod}
                person={person}
                tilkommeneInntektskilder={tilkommeneInntektskilder}
            />
        );
    } else {
        return null;
    }
}
