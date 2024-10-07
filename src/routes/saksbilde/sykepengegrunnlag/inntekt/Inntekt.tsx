import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { ArbeidsgiverFragment, Arbeidsgiverinntekt, Maybe, PersonFragment, VilkarsgrunnlagSpleis } from '@io/graphql';
import {
    useArbeidsgiver,
    useInntektsmeldinghendelser,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { mapOgSorterRefusjoner } from '@state/overstyring';
import { useActivePeriod } from '@state/periode';
import { DateString } from '@typer/shared';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { useVilkårsgrunnlag } from '../useVilkårsgrunnlag';
import { InntektOgRefusjon } from './inntektOgRefusjon/InntektOgRefusjon';

import styles from './Inntekt.module.css';

const hasSykefravær = (arbeidsgiver: ArbeidsgiverFragment, fom: DateString): boolean => {
    return !!arbeidsgiver?.generasjoner[0]?.perioder.find((it) => it.fom === fom);
};

interface InntektContainerProps {
    person: PersonFragment;
    inntekt: Arbeidsgiverinntekt;
}

const InntektContainer = ({ person, inntekt }: InntektContainerProps): Maybe<ReactElement> => {
    const aktivPeriode = useActivePeriod(person);
    const periodeForSkjæringstidspunktForArbeidsgiver = usePeriodForSkjæringstidspunktForArbeidsgiver(
        person,
        aktivPeriode?.skjaeringstidspunkt ?? null,
        inntekt.arbeidsgiver,
    );
    const arbeidsgiver = useArbeidsgiver(person, inntekt.arbeidsgiver);
    const inntektsmeldinghendelser = useInntektsmeldinghendelser(arbeidsgiver);

    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periodeForSkjæringstidspunktForArbeidsgiver);
    const vilkårsgrunnlagAktivPeriode = useVilkårsgrunnlag(person, aktivPeriode);
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
        : aktivPeriode !== null && !isUberegnetPeriode(aktivPeriode)
          ? aktivPeriode.vilkarsgrunnlagId
          : null;

    if (!aktivPeriode || !periodeForSkjæringstidspunktForArbeidsgiver || !arbeidsgiver || !vilkårsgrunnlagId) {
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
            periode={periodeForSkjæringstidspunktForArbeidsgiver}
            inntektFraAOrdningen={
                arbeidsgiver.inntekterFraAordningen.find(
                    (it) => it.skjaeringstidspunkt === periodeForSkjæringstidspunktForArbeidsgiver.skjaeringstidspunkt,
                )?.inntekter
            }
            inntekt={inntekt}
            vilkårsgrunnlagId={vilkårsgrunnlagId}
            arbeidsgiver={arbeidsgiver}
            refusjon={refusjonsopplysninger}
            harSykefravær={arbeidsgiverHarSykefraværForPerioden}
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
