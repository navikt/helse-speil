import classNames from 'classnames';
import React from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import {
    Arbeidsgiver,
    Arbeidsgiverinntekt,
    BeregnetPeriode,
    Hendelsetype,
    Kildetype,
    Refusjonselement,
} from '@io/graphql';
import { Refusjonsopplysning } from '@io/http';
import { useArbeidsgiver, usePeriodForSkjæringstidspunktForArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { useVilkårsgrunnlag } from '../Sykepengegrunnlag';
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
        inntekt.arbeidsgiver
    );
    const arbeidsgiver = useArbeidsgiver(inntekt.arbeidsgiver);

    const vilkårsgrunnlag = useVilkårsgrunnlag(person, periodeForSkjæringstidspunktForArbeidsgiver);
    const arbeidsgiverrefusjon =
        vilkårsgrunnlag && isBeregnetPeriode(periodeForSkjæringstidspunktForArbeidsgiver)
            ? vilkårsgrunnlag.arbeidsgiverrefusjoner.find(
                  (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === arbeidsgiver?.organisasjonsnummer
              )
            : null;

    if (
        !periodeForSkjæringstidspunktForArbeidsgiver ||
        !arbeidsgiver ||
        isUberegnetPeriode(periodeForSkjæringstidspunktForArbeidsgiver) ||
        !periodeForSkjæringstidspunktForArbeidsgiver.vilkarsgrunnlagId
    ) {
        return null;
    }

    const arbeidsgiverHarSykefraværForPerioden = hasSykefravær(
        arbeidsgiver,
        periodeForSkjæringstidspunktForArbeidsgiver.fom
    );

    const refusjonsopplysninger = mapOgSorterRefusjoner(
        periodeForSkjæringstidspunktForArbeidsgiver,
        arbeidsgiverrefusjon?.refusjonsopplysninger
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
            vilkårsgrunnlagId={periodeForSkjæringstidspunktForArbeidsgiver.vilkarsgrunnlagId}
            inntektstype={(periodeForSkjæringstidspunktForArbeidsgiver as BeregnetPeriode).inntektstype}
            arbeidsgiver={arbeidsgiver}
            refusjon={refusjonsopplysninger}
            harSykefravær={arbeidsgiverHarSykefraværForPerioden}
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

export const mapOgSorterRefusjoner = (
    period: ActivePeriod,
    refusjonselementer?: Refusjonselement[]
): Refusjonsopplysning[] => {
    const hendelseIderForInntektsmelding: string[] = isBeregnetPeriode(period)
        ? period.hendelser
              .filter((hendelse) => hendelse.type === Hendelsetype.Inntektsmelding)
              .map((hendelse) => hendelse.id)
        : [];

    const refusjonsopplysninger: Refusjonsopplysning[] | undefined =
        refusjonselementer &&
        [...refusjonselementer]
            .sort((a: Refusjonselement, b: Refusjonselement) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
            .map((it) => ({
                fom: it.fom,
                tom: it.tom,
                beløp: it.belop,
                kilde: hendelseIderForInntektsmelding.includes(it.meldingsreferanseId)
                    ? Kildetype.Inntektsmelding
                    : Kildetype.Saksbehandler,
            }));

    return refusjonsopplysninger ?? [];
};
