import NextLink from 'next/link';
import React, { PropsWithChildren } from 'react';

import { InformationSquareIcon } from '@navikt/aksel-icons';
import { InfoCard, Link, VStack } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import { SaksbildeVarsel } from '@saksbilde/SaksbildeVarsel';
import { Verktøylinje } from '@saksbilde/Verktøylinje';
import { SaksbildeMenu } from '@saksbilde/saksbildeMenu/SaksbildeMenu';
import { PeriodeViewError } from '@saksbilde/saksbilder/PeriodeViewError';
import { PeriodeViewSkeleton } from '@saksbilde/saksbilder/PeriodeViewSkeleton';
import { harPeriodeDagerMedUnder20ProsentTotalGrad } from '@saksbilde/utbetaling/utbetalingstabell/arbeidstidsvurdering/arbeidstidsvurdering';
import { finnInitierendeVedtaksperiodeIdFraOverlappendePeriode } from '@saksbilde/utils';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

import styles from './saksbilder/SharedViews.module.css';

export const Saksbilde = ({ children }: PropsWithChildren) => {
    const { loading, data, error } = useFetchPersonQuery();

    const person: PersonFragment | null = data?.person ?? null;
    const aktivPeriode = useActivePeriod(person);

    if (loading) {
        return <PeriodeViewSkeleton />;
    }

    if (error || !person) {
        return <PeriodeViewError />;
    }

    if (!aktivPeriode) {
        return (
            <InfoCard data-color="info" className="m-8 [grid-area:content]">
                <InfoCard.Header icon={<InformationSquareIcon aria-hidden />}>
                    <InfoCard.Title>Vi fant ingen vedtaksperioder for personen</InfoCard.Title>
                </InfoCard.Header>
                <VStack as={InfoCard.Content}>
                    Vi fant ingen vedtaksperioder for personen og har derfor ingenting å vise her.
                    <Link as={NextLink} href="/">
                        Klikk her for å gå tilbake til oppgaveoversikten
                    </Link>
                </VStack>
            </InfoCard>
        );
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
