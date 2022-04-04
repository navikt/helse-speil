import React from 'react';

import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';
import { Arbeidsgiverinntekt } from '@io/graphql';
import { useActivePeriod } from '@state/periodState';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Varsel } from '@components/Varsel';

import { InntektGhostPeriode } from './InntektGhostPeriode';
import { InntektBeregnetPeriode } from './InntektBeregnetPeriode';

interface InntektContainerProps {
    inntekt: Arbeidsgiverinntekt;
}

const InntektContainer: React.VFC<InntektContainerProps> = ({ inntekt }) => {
    const periode = useActivePeriod();

    if (isGhostPeriode(periode)) {
        return (
            <InntektGhostPeriode
                skjæringstidspunkt={periode.skjaeringstidspunkt}
                omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                organisasjonsnummer={inntekt.arbeidsgiver}
                erDeaktivert={inntekt.deaktivert}
            />
        );
    } else if (isBeregnetPeriode(periode)) {
        return (
            <InntektBeregnetPeriode
                skjæringstidspunkt={periode.skjaeringstidspunkt}
                omregnetÅrsinntekt={inntekt.omregnetArsinntekt}
                organisasjonsnummer={inntekt.arbeidsgiver}
                vilkårsgrunnlagId={periode.vilkarsgrunnlaghistorikkId}
                inntektstype={periode.inntektstype}
            />
        );
    } else {
        return null;
    }
};

const InntektError = () => {
    return <Varsel variant="feil">Det har skjedd en feil. Kunne ikke vise inntekt for denne perioden.</Varsel>;
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
