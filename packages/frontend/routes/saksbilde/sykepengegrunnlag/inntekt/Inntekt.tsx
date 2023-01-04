import { InntektMedSykefravær } from './InntektMedSykefravær';
import { InntektUtenSykefravær } from './InntektUtenSykefravær';
import React from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import {
    Arbeidsgiver,
    Arbeidsgiverinntekt,
    Arbeidsgiverrefusjon,
    BeregnetPeriode,
    Hendelsetype,
    Kildetype,
    Refusjonselement,
} from '@io/graphql';
import { Refusjonsopplysning } from '@io/http';
import { useArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { isBeregnetPeriode, isUberegnetPeriode } from '@utils/typeguards';

import styles from './Inntekt.module.css';

const hasSykefravær = (arbeidsgiver: Arbeidsgiver, fom: DateString): boolean => {
    return !!arbeidsgiver?.generasjoner[0]?.perioder.find((it) => it.fom === fom);
};

interface InntektContainerProps {
    inntekt: Arbeidsgiverinntekt;
    refusjon?: Maybe<Arbeidsgiverrefusjon>;
}

const InntektContainer: React.FC<InntektContainerProps> = ({ inntekt, refusjon }) => {
    const period = useActivePeriod();
    const arbeidsgiver = useArbeidsgiver(inntekt.arbeidsgiver);

    if (!period || !arbeidsgiver || isUberegnetPeriode(period) || !period.vilkarsgrunnlagId) {
        return null;
    }
    const arbeidsgiverHarSykefraværForPerioden = hasSykefravær(arbeidsgiver, period.fom);

    const refusjonsopplysninger = mapOgSorterRefusjoner(period, refusjon?.refusjonsopplysninger);

    if (arbeidsgiverHarSykefraværForPerioden) {
        return (
            <InntektMedSykefravær
                skjæringstidspunkt={period.skjaeringstidspunkt}
                omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                organisasjonsnummer={inntekt.arbeidsgiver}
                vilkårsgrunnlagId={period.vilkarsgrunnlagId}
                inntektstype={(period as BeregnetPeriode).inntektstype}
                erDeaktivert={inntekt.deaktivert}
                arbeidsgiver={arbeidsgiver}
                refusjon={refusjonsopplysninger}
            />
        );
    } else {
        return (
            <InntektUtenSykefravær
                skjæringstidspunkt={period.skjaeringstidspunkt}
                omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                organisasjonsnummer={inntekt.arbeidsgiver}
                erDeaktivert={inntekt.deaktivert}
                vilkårsgrunnlagId={period.vilkarsgrunnlagId}
                arbeidsgiver={arbeidsgiver}
                refusjon={refusjonsopplysninger}
            />
        );
    }
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
    refusjon?: Maybe<Arbeidsgiverrefusjon>;
}

export const Inntekt: React.FC<InntektProps> = ({ inntekt, refusjon }) => {
    return (
        <ErrorBoundary fallback={<InntektError />}>
            <InntektContainer inntekt={inntekt} refusjon={refusjon} />
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
