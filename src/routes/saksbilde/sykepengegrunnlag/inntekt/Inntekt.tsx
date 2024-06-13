import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import {
    ArbeidsgiverFragment,
    Arbeidsgiverinntekt,
    BeregnetPeriodeFragment,
    Maybe,
    PersonFragment,
    VilkarsgrunnlagSpleis,
} from '@io/graphql';
import {
    useArbeidsgiver,
    useInntektsmeldinghendelser,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { mapOgSorterRefusjoner } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import { DateString } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { useVilkårsgrunnlag } from '../useVilkårsgrunnlag';
import { InntektOgRefusjon } from './InntektOgRefusjon';

import styles from './Inntekt.module.css';

const hasSykefravær = (arbeidsgiver: ArbeidsgiverFragment, fom: DateString): boolean => {
    return !!arbeidsgiver?.generasjoner[0]?.perioder.find((it) => it.fom === fom);
};

interface InntektContainerProps {
    person: PersonFragment;
    inntekt: Arbeidsgiverinntekt;
}

const InntektContainer = ({ person, inntekt }: InntektContainerProps): Maybe<ReactElement> => {
    const period = useActivePeriod();
    const periodeForSkjæringstidspunktForArbeidsgiver = usePeriodForSkjæringstidspunktForArbeidsgiver(
        period?.skjaeringstidspunkt ?? null,
        inntekt.arbeidsgiver,
    );
    const arbeidsgiver = useArbeidsgiver(inntekt.arbeidsgiver);
    const inntektsmeldinghendelser = useInntektsmeldinghendelser(arbeidsgiver);

    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periodeForSkjæringstidspunktForArbeidsgiver);
    const vilkårsgrunnlagAktivPeriode = useVilkårsgrunnlag(person, period);
    const uberegnetAGfinnesIVilkårsgrunnlaget = vilkårsgrunnlagAktivPeriode?.arbeidsgiverrefusjoner.find(
        (it) => it.arbeidsgiver === arbeidsgiver?.organisasjonsnummer,
    );

    const arbeidsgiverrefusjon =
        vilkårsgrunnlag && isBeregnetPeriode(periodeForSkjæringstidspunktForArbeidsgiver)
            ? vilkårsgrunnlag.arbeidsgiverrefusjoner.find(
                  (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === arbeidsgiver?.organisasjonsnummer,
              )
            : isUberegnetPeriode(periodeForSkjæringstidspunktForArbeidsgiver) && uberegnetAGfinnesIVilkårsgrunnlaget
              ? vilkårsgrunnlagAktivPeriode?.arbeidsgiverrefusjoner.find(
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
        inntektsmeldinghendelser,
        arbeidsgiverrefusjon?.refusjonsopplysninger,
    );

    return (
        <InntektOgRefusjon
            person={person}
            inntektFraAOrdningen={
                arbeidsgiver.inntekterFraAordningen.find(
                    (it) => it.skjaeringstidspunkt === periodeForSkjæringstidspunktForArbeidsgiver.skjaeringstidspunkt,
                )?.inntekter
            }
            skjæringstidspunkt={periodeForSkjæringstidspunktForArbeidsgiver.skjaeringstidspunkt}
            omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
            organisasjonsnummer={inntekt.arbeidsgiver}
            erDeaktivert={inntekt.deaktivert}
            vilkårsgrunnlagId={vilkårsgrunnlagId}
            periodeId={periodeForSkjæringstidspunktForArbeidsgiver.id}
            inntektstype={(periodeForSkjæringstidspunktForArbeidsgiver as BeregnetPeriodeFragment).inntektstype}
            arbeidsgiver={arbeidsgiver}
            refusjon={refusjonsopplysninger}
            harSykefravær={arbeidsgiverHarSykefraværForPerioden}
            erGhostperiode={isGhostPeriode(periodeForSkjæringstidspunktForArbeidsgiver)}
            inntekterForSammenligningsgrunnlag={
                ((vilkårsgrunnlag as VilkarsgrunnlagSpleis)?.avviksprosent ?? 0) > 25
                    ? inntekt.sammenligningsgrunnlag?.inntektFraAOrdningen
                    : []
            }
        />
    );
};

const InntektError = (): ReactElement => {
    return (
        <Alert variant="error" size="small" className={styles.Inntekt}>
            Det har skjedd en feil. Kunne ikke vise inntekt for denne perioden.
        </Alert>
    );
};

interface InntektProps {
    person: PersonFragment;
    inntekt: Arbeidsgiverinntekt;
}

export const Inntekt = ({ person, inntekt }: InntektProps): ReactElement => {
    return (
        <ErrorBoundary fallback={<InntektError />}>
            <div className={classNames(styles.Inntektskilderinnhold, inntekt.deaktivert && styles.deaktivert)}>
                <InntektContainer person={person} inntekt={inntekt} />
            </div>
        </ErrorBoundary>
    );
};
