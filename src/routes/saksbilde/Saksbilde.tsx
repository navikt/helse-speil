import React from 'react';
import * as R from 'remeda';

import { useBrukerGrupper, useBrukerIdent } from '@auth/brukerContext';
import { Maybe, PeriodeFragment, PersonFragment } from '@io/graphql';
import { SaksbildeVarsel } from '@saksbilde/SaksbildeVarsel';
import { Verktøylinje } from '@saksbilde/Verktøylinje';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { PeriodeViewError } from '@saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@saksbilde/saksbilder/PeriodeViewSkeleton';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
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

    const allePerioderPåSkjæringstidspunkt: PeriodeFragment[] = R.pipe(
        person.arbeidsgivere,
        R.flatMap((ag) => ag.generasjoner?.[0]?.perioder),
        R.filter((periode) => isBeregnetPeriode(periode) || isUberegnetPeriode(periode)),
        R.filter((periode) => periode.skjaeringstidspunkt === activePeriod.skjaeringstidspunkt),
    );

    const sammenfallendePerioder = allePerioderPåSkjæringstidspunkt.filter(
        (periode) => periode.fom === activePeriod.fom && periode.tom === activePeriod.tom,
    );

    const harDagerMedUnder20ProsentTotalGrad = sammenfallendePerioder
        .flatMap((periode) => periode.tidslinje)
        .find((dag) => (dag?.utbetalingsinfo?.totalGrad ?? 100) < 20);

    const initierendeVedtaksperiodeId =
        isBeregnetPeriode(activePeriod) || isUberegnetPeriode(activePeriod)
            ? activePeriod.vedtaksperiodeId
            : sammenfallendePerioder?.shift()?.vedtaksperiodeId;

    return (
        <div className={styles.Content}>
            {kanOverstyreMinimumSykdomsgradToggle(saksbehandlerident, grupper) &&
                !harPeriodeTilBeslutterFor(person, activePeriod?.skjaeringstidspunkt) &&
                harDagerMedUnder20ProsentTotalGrad &&
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
