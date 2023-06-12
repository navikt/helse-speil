import classNames from 'classnames';
import React from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Arbeidsgiver, Arbeidsgiverinntekt, BeregnetPeriode } from '@io/graphql';
import { useArbeidsgiver, usePeriodForSkjæringstidspunktForArbeidsgiver } from '@state/arbeidsgiver';
import { mapOgSorterRefusjoner } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { useVilkårsgrunnlag } from '../useVilkårsgrunnlag';
import { InntektOgRefusjon } from './InntektOgRefusjon';

import styles from './Inntekt.module.css';

const hasSykefravær = (arbeidsgiver: Arbeidsgiver, fom: DateString): boolean => {
    return !!arbeidsgiver?.generasjoner[0]?.perioder.find((it) => it.fom === fom);
};

interface InntektContainerProps {
    inntekt: Arbeidsgiverinntekt;
}

const InntektContainer: React.FC<InntektContainerProps> = ({ inntekt }) => {
    const person = useCurrentPerson();
    const period = useActivePeriod();
    const periodeForSkjæringstidspunktForArbeidsgiver = usePeriodForSkjæringstidspunktForArbeidsgiver(
        period?.skjaeringstidspunkt ?? null,
        inntekt.arbeidsgiver,
    );
    const arbeidsgiver = useArbeidsgiver(inntekt.arbeidsgiver);

    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periodeForSkjæringstidspunktForArbeidsgiver);
    const arbeidsgiverrefusjon =
        vilkårsgrunnlag && isBeregnetPeriode(periodeForSkjæringstidspunktForArbeidsgiver)
            ? vilkårsgrunnlag.arbeidsgiverrefusjoner.find(
                  (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === arbeidsgiver?.organisasjonsnummer,
              )
            : null;

    const vilkårsgrunnlagId = !isUberegnetPeriode(periodeForSkjæringstidspunktForArbeidsgiver)
        ? periodeForSkjæringstidspunktForArbeidsgiver?.vilkarsgrunnlagId
        : period !== null && !isUberegnetPeriode(period)
        ? period.vilkarsgrunnlagId
        : null;

    if (!period || !periodeForSkjæringstidspunktForArbeidsgiver || !arbeidsgiver || !vilkårsgrunnlagId) {
        return null;
    }

    const arbeidsgiverHarSykefraværForPerioden = hasSykefravær(
        arbeidsgiver,
        periodeForSkjæringstidspunktForArbeidsgiver.fom,
    );

    const refusjonsopplysninger = mapOgSorterRefusjoner(
        periodeForSkjæringstidspunktForArbeidsgiver,
        arbeidsgiverrefusjon?.refusjonsopplysninger,
    );

    return (
        <InntektOgRefusjon
            inntektFraAOrdningen={
                isBeregnetPeriode(periodeForSkjæringstidspunktForArbeidsgiver)
                    ? periodeForSkjæringstidspunktForArbeidsgiver.inntektFraAordningen
                    : undefined
            }
            skjæringstidspunkt={periodeForSkjæringstidspunktForArbeidsgiver.skjaeringstidspunkt}
            omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
            organisasjonsnummer={inntekt.arbeidsgiver}
            erDeaktivert={inntekt.deaktivert}
            vilkårsgrunnlagId={vilkårsgrunnlagId}
            periodeId={periodeForSkjæringstidspunktForArbeidsgiver.id}
            inntektstype={(periodeForSkjæringstidspunktForArbeidsgiver as BeregnetPeriode).inntektstype}
            arbeidsgiver={arbeidsgiver}
            refusjon={refusjonsopplysninger}
            harSykefravær={arbeidsgiverHarSykefraværForPerioden}
            erGhostperiode={isGhostPeriode(periodeForSkjæringstidspunktForArbeidsgiver)}
        />
    );
};

const InntektError = () => {
    return (
        <Alert variant="error" size="small" className={styles.Inntekt}>
            Det har skjedd en feil. Kunne ikke vise inntekt for denne perioden.
        </Alert>
    );
};

interface InntektProps {
    inntekt: Arbeidsgiverinntekt;
}

export const Inntekt: React.FC<InntektProps> = ({ inntekt }) => {
    return (
        <ErrorBoundary fallback={<InntektError />}>
            <div className={classNames(styles.Inntektskilderinnhold, inntekt.deaktivert && styles.deaktivert)}>
                <InntektContainer inntekt={inntekt} />
            </div>
        </ErrorBoundary>
    );
};
