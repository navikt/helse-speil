import { ReactElement } from 'react';

import { BodyShort, HStack, Skeleton, VStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { TidslinjeContent } from '@saksbilde/tidslinje/TidslinjeContent';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';

export function Tidslinje(): ReactElement {
    return (
        <ErrorBoundary fallback={<TimelineError />}>
            <TidslinjeContainer />
        </ErrorBoundary>
    );
}

function TidslinjeContainer(): ReactElement | null {
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
        <TidslinjeContent
            person={person}
            inntektsforhold={inntektsforhold}
            infotrygdutbetalinger={infotrygdutbetalinger ?? []}
            activePeriod={activePeriod}
        />
    );
}

function TimelineSkeleton(): ReactElement {
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
}

function TimelineError(): ReactElement {
    return (
        <div className="w-full border-b border-b-ax-border-neutral-subtle bg-ax-bg-danger-soft p-6 [grid-area:timeline]">
            <BodyShort>Det har skjedd en feil. Kan ikke vise tidslinjen for denne personen.</BodyShort>
        </div>
    );
}
