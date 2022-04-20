import styled from '@emotion/styled';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { FlexColumn } from '@components/Flex';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import {
    useActiveGenerationIsLast,
    useActivePeriodHasLatestSkjæringstidspunkt,
    useOverstyrRevurderingIsEnabled,
    useRevurderingIsEnabled,
} from '@hooks/revurdering';
import { useOverstyringIsEnabled } from '@hooks/useOverstyringIsEnabled';

import { defaultUtbetalingToggles } from '@utils/featureToggles';
import { Utbetalingstabell } from './utbetalingstabell/Utbetalingstabell';
import { useTabelldagerMap } from './utbetalingstabell/useTabelldagerMap';
import { Arbeidsgiver, BeregnetPeriode, Dagoverstyring, Overstyring } from '@io/graphql';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useActivePeriod } from '@state/periode';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { isBeregnetPeriode } from '@utils/typeguards';
import { Varsel } from '@components/Varsel';
import { OverstyrbarUtbetaling } from './OverstyrbarUtbetaling';

const Container = styled(FlexColumn)<{ overstyrer: boolean }>`
    position: relative;
    padding-right: ${(props) => (props.overstyrer ? '1rem' : '2rem')};
    margin-left: ${(props) => (props.overstyrer ? '0.5rem' : '0')};
    border-left: ${(props) => (props.overstyrer ? '6px solid #0067C5' : '0')};
    margin-top: 1rem;
`;

const UtbetalingstabellContainer = styled(FlexColumn)<{ overstyrer: boolean }>`
    position: relative;
    height: 100%;
    padding-top: 2rem;
    background-color: ${(props) => (props.overstyrer ? 'var(--speil-overstyring-background)' : 'inherit')};
`;

const InfobobleContainer = styled.div`
    margin-top: 1rem;
    min-height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 0 2rem;
    width: 100%;
`;

interface ReadonlyUtbetalingProps {
    fom: DateString;
    tom: DateString;
    dager: Map<string, UtbetalingstabellDag>;
}

const ReadonlyUtbetaling: React.FC<ReadonlyUtbetalingProps> = ({ fom, tom, dager }) => {
    const hasLatestSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();
    const activeGenerationIsLast = useActiveGenerationIsLast();

    return (
        <Container overstyrer={false}>
            {!hasLatestSkjæringstidspunkt && activeGenerationIsLast && (
                <InfobobleContainer>
                    <PopoverHjelpetekst ikon={<SortInfoikon />}>
                        <p>Det er foreløpig ikke støtte for endringer i saker i tidligere skjæringstidspunkt</p>
                    </PopoverHjelpetekst>
                </InfobobleContainer>
            )}
            <UtbetalingstabellContainer data-testid="utbetaling" overstyrer={false}>
                <Utbetalingstabell fom={fom} tom={tom} dager={dager} />
            </UtbetalingstabellContainer>
        </Container>
    );
};

const isDagoverstyring = (overstyring: Overstyring): overstyring is Dagoverstyring =>
    (overstyring as Dagoverstyring).__typename === 'Dagoverstyring';

const useDagoverstyringer = (arbeidsgiver: Arbeidsgiver, fom: DateString, tom: DateString): Array<Dagoverstyring> => {
    return useMemo(() => {
        const start = dayjs(fom);
        const end = dayjs(tom);
        return arbeidsgiver.overstyringer.filter(isDagoverstyring).filter((overstyring) =>
            overstyring.dager.some((dag) => {
                const dato = dayjs(dag.dato);
                return dato.isSameOrAfter(start) && dato.isSameOrBefore(end);
            }),
        );
    }, [arbeidsgiver, fom, tom]);
};

interface UtbetalingWithContentProps {
    period: BeregnetPeriode;
    arbeidsgiver: Arbeidsgiver;
}

const UtbetalingWithContent: React.FC<UtbetalingWithContentProps> = React.memo(({ period, arbeidsgiver }) => {
    const overstyringIsEnabled = useOverstyringIsEnabled();
    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);
    const overstyrRevurderingIsEnabled = useOverstyrRevurderingIsEnabled(defaultUtbetalingToggles);
    const activePeriodHasLatestSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();
    const dagoverstyringer = useDagoverstyringer(arbeidsgiver, period.fom, period.tom);

    const dager: Map<string, UtbetalingstabellDag> = useTabelldagerMap({
        tidslinje: period.tidslinje,
        gjenståendeDager: period.gjenstaendeSykedager,
        overstyringer: dagoverstyringer,
        maksdato: period.maksdato,
    });

    return (revurderingIsEnabled || overstyringIsEnabled || overstyrRevurderingIsEnabled) &&
        activePeriodHasLatestSkjæringstidspunkt ? (
        <OverstyrbarUtbetaling
            fom={period.fom}
            tom={period.tom}
            dager={dager}
            skjæringstidspunkt={period.skjaeringstidspunkt}
            utbetaling={period.utbetaling}
            revurderingIsEnabled={revurderingIsEnabled}
            overstyrRevurderingIsEnabled={overstyrRevurderingIsEnabled}
        />
    ) : (
        <ReadonlyUtbetaling fom={period.fom} tom={period.tom} dager={dager} />
    );
});

const UtbetalingContainer = () => {
    const activePeriod = useActivePeriod();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!activePeriod || !currentArbeidsgiver) {
        return null;
    } else if (isBeregnetPeriode(activePeriod)) {
        return <UtbetalingWithContent period={activePeriod} arbeidsgiver={currentArbeidsgiver} />;
    } else {
        return null;
    }
};

const UtbetalingSkeleton = () => {
    return <div />;
};

const UtbetalingError = () => {
    return <Varsel variant="feil">Noe gikk galt. Kan ikke vise utbetaling for denne perioden.</Varsel>;
};

export const Utbetaling = () => {
    return (
        <React.Suspense fallback={<UtbetalingSkeleton />}>
            <ErrorBoundary fallback={<UtbetalingError />}>
                <UtbetalingContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};

export default Utbetaling;
