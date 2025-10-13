import React, { PropsWithChildren } from 'react';

import { Maybe, PersonFragment } from '@io/graphql';
import { SaksbildeVarsel } from '@saksbilde/SaksbildeVarsel';
import { Verktøylinje } from '@saksbilde/Verktøylinje';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { PeriodeViewError } from '@saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@saksbilde/saksbilder/PeriodeViewSkeleton';
import { harPeriodeDagerMedUnder20ProsentTotalGrad } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/minimumSykdomsgrad';
import { finnInitierendeVedtaksperiodeIdFraOverlappendePeriode } from '@saksbilde/utils';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

import styles from './saksbilder/SharedViews.module.css';

export const Saksbilde = ({ children }: PropsWithChildren) => {
    const { loading, data, error } = useFetchPersonQuery();

    const person: Maybe<PersonFragment> = data?.person ?? null;
    const aktivPeriode = useActivePeriod(person);

    if (loading) {
        return <PeriodeViewSkeleton />;
    }

    if (error || !person) {
        return <PeriodeViewError />;
    }

    if (!aktivPeriode) {
        return <PeriodeViewError />;
    }

    const inntektsforhold = finnAlleInntektsforhold(person);
    const initierendeVedtaksperiodeId =
        isBeregnetPeriode(aktivPeriode) || isUberegnetPeriode(aktivPeriode)
            ? aktivPeriode.vedtaksperiodeId
            : finnInitierendeVedtaksperiodeIdFraOverlappendePeriode(inntektsforhold, aktivPeriode);

    const periodeHarDatoerMedUnder20ProsentTotalGrad = harPeriodeDagerMedUnder20ProsentTotalGrad(
        aktivPeriode,
        inntektsforhold,
        aktivPeriode.skjaeringstidspunkt,
    );

    return (
        <div className={styles.Content}>
            {periodeHarDatoerMedUnder20ProsentTotalGrad && initierendeVedtaksperiodeId && (
                <Verktøylinje
                    person={person}
                    aktivPeriode={aktivPeriode}
                    initierendeVedtaksperiodeId={initierendeVedtaksperiodeId}
                />
            )}
            <SaksbildeVarsel person={person} periode={aktivPeriode} />
            <SaksbildeMenu person={person} activePeriod={aktivPeriode} />
            <>{children}</>
        </div>
    );
};
