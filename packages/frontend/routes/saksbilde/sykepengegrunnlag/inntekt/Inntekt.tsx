import React from 'react';
import { Arbeidsgiver, Arbeidsgiverinntekt, BeregnetPeriode } from '@io/graphql';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Varsel } from '@components/Varsel';

import { InntektUtenSykefravær } from './InntektUtenSykefravær';
import { InntektMedSykefravær } from './InntektMedSykefravær';
import { useActivePeriod } from '@state/periode';
import { isUberegnetPeriode } from '@utils/typeguards';
import { useArbeidsgiver } from '@state/arbeidsgiver';

const hasSykefravær = (arbeidsgiver: Arbeidsgiver, fom: DateString): boolean => {
    return !!arbeidsgiver?.generasjoner[0]?.perioder.find((it) => it.fom === fom);
};

interface InntektContainerProps {
    inntekt: Arbeidsgiverinntekt;
}

const InntektContainer: React.VFC<InntektContainerProps> = ({ inntekt }) => {
    const period = useActivePeriod();
    const arbeidsgiver = useArbeidsgiver(inntekt.arbeidsgiver);

    if (!period || !arbeidsgiver || isUberegnetPeriode(period)) {
        return null;
    }

    const arbeidsgiverHarSykefraværForPerioden = hasSykefravær(arbeidsgiver, period.fom);

    if (arbeidsgiverHarSykefraværForPerioden) {
        return (
            <InntektMedSykefravær
                skjæringstidspunkt={period.skjaeringstidspunkt}
                omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                organisasjonsnummer={inntekt.arbeidsgiver}
                vilkårsgrunnlagId={(period as BeregnetPeriode).vilkarsgrunnlaghistorikkId}
                inntektstype={(period as BeregnetPeriode).inntektstype}
                erDeaktivert={inntekt.deaktivert}
            />
        );
    } else {
        return (
            <InntektUtenSykefravær
                skjæringstidspunkt={period.skjaeringstidspunkt}
                omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                organisasjonsnummer={inntekt.arbeidsgiver}
                erDeaktivert={inntekt.deaktivert}
                vilkårsgrunnlagId={period.vilkarsgrunnlaghistorikkId}
            />
        );
    }
};

const InntektError = () => {
    return <Varsel variant="error">Det har skjedd en feil. Kunne ikke vise inntekt for denne perioden.</Varsel>;
};

interface InntektProps {
    inntekt: Arbeidsgiverinntekt;
}

export const Inntekt: React.VFC<InntektProps> = ({ inntekt }) => {
    return (
        <ErrorBoundary fallback={<InntektError />}>
            <InntektContainer inntekt={inntekt} />
        </ErrorBoundary>
    );
};
