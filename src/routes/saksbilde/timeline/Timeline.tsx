import { ReactElement } from 'react';

import { BodyShort, HStack, Skeleton, VStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Tidslinje } from '@saksbilde/tidslinje/Tidslinje';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { cn } from '@utils/tw';

import styles from './Timeline.module.css';

const TimelineContainer = (): ReactElement | null => {
    const { loading, data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const activePeriod = useActivePeriod(person);

    if (loading) {
        return <TimelineSkeleton />;
    }
    if (!person) {
        return null;
    }

    const inntektsforhold = finnAlleInntektsforhold(person);
    const infotrygdutbetalinger = person.infotrygdutbetalinger;

    return (
        <div className="relative [grid-area:timeline]">
            <Tidslinje
                person={person}
                inntektsforhold={inntektsforhold}
                infotrygdutbetalinger={infotrygdutbetalinger ?? []}
                activePeriod={activePeriod}
            />
        </div>
    );
};

const TimelineSkeleton = (): ReactElement => {
    return (
        <VStack
            gap="space-12"
            className="w-full border-b border-b-ax-border-neutral-subtle p-6 pt-14 [grid-area:timeline]"
        >
            <HStack gap="space-16" wrap={false}>
                <Skeleton width={260} height={40} />
                <Skeleton height={40} className="grow" />
            </HStack>
            <HStack gap="space-16" wrap={false}>
                <Skeleton width={260} height={40} />
                <Skeleton height={40} className="grow" />
            </HStack>
            <HStack justify="space-between">
                <Skeleton width={260} height={40} />
                <Skeleton width={250} height={40} />
            </HStack>
        </VStack>
    );
};

const TimelineError = (): ReactElement => {
    return (
        <div className={cn(styles.Timeline, styles.Error)}>
            <BodyShort>Det har skjedd en feil. Kan ikke vise tidslinjen for denne personen.</BodyShort>
        </div>
    );
};

export const Timeline = (): ReactElement => (
    <ErrorBoundary fallback={<TimelineError />}>
        <TimelineContainer />
    </ErrorBoundary>
);
