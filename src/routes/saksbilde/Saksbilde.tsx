import React from 'react';

import { useBrukerGrupper, useBrukerIdent } from '@auth/brukerContext';
import { Maybe, PersonFragment } from '@io/graphql';
import { SaksbildeVarsel } from '@saksbilde/SaksbildeVarsel';
import { Verktøylinje } from '@saksbilde/Verktøylinje';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { PeriodeViewError } from '@saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@saksbilde/saksbilder/PeriodeViewSkeleton';
import { harPeriodeDagerMedUnder20ProsentTotalGrad } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/minimumSykdomsgrad';
import { finnInitierendeVedtaksperiodeIdFraOverlappendePeriode } from '@saksbilde/utils';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { kanOverstyreMinimumSykdomsgradToggle } from '@utils/featureToggles';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

import styles from './saksbilder/SharedViews.module.css';

interface SaksbildeProps {
    children?: React.ReactNode;
}

export const Saksbilde = ({ children }: SaksbildeProps) => {
    const { loading, data, error } = useFetchPersonQuery();

    const person: Maybe<PersonFragment> = data?.person ?? null;
    const activePeriod = useActivePeriod(person);
    const saksbehandlerident = useBrukerIdent();
    const grupper = useBrukerGrupper();

    if (loading) {
        return <PeriodeViewSkeleton />;
    }

    if (error || !activePeriod || !person) {
        return <PeriodeViewError />;
    }

    const initierendeVedtaksperiodeId =
        isBeregnetPeriode(activePeriod) || isUberegnetPeriode(activePeriod)
            ? activePeriod.vedtaksperiodeId
            : finnInitierendeVedtaksperiodeIdFraOverlappendePeriode(person.arbeidsgivere, activePeriod);

    const periodeHarDatoerMedUnder20ProsentTotalGrad = harPeriodeDagerMedUnder20ProsentTotalGrad(
        activePeriod,
        person.arbeidsgivere,
        activePeriod.skjaeringstidspunkt,
    );

    return (
        <div className={styles.Content}>
            {kanOverstyreMinimumSykdomsgradToggle(saksbehandlerident, grupper) &&
                periodeHarDatoerMedUnder20ProsentTotalGrad &&
                initierendeVedtaksperiodeId && (
                    <Verktøylinje
                        person={person}
                        periode={activePeriod}
                        initierendeVedtaksperiodeId={initierendeVedtaksperiodeId}
                    />
                )}
            <SaksbildeVarsel person={person} periode={activePeriod} />
            <SaksbildeMenu person={person} activePeriod={activePeriod} />
            {children}
        </div>
    );
};
