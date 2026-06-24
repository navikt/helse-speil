import React, { PropsWithChildren, ReactElement } from 'react';

import { BodyShort, HStack, Skeleton } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Kjonn } from '@io/graphql';
import { useIsAnonymous } from '@state/anonymization';
import { useFetchPersonQuery } from '@state/person';
import { cn } from '@utils/tw';

import { GenderIcon } from './GenderIcon';
import { PersonHeaderWithContent } from './PersonHeaderWithContent';

export function PersonHeaderSeparator(): ReactElement {
    return (
        <BodyShort as="span" aria-hidden="true" className="mx-4">
            /
        </BodyShort>
    );
}

export function PersonHeaderFrame({ children, className }: PropsWithChildren<{ className?: string }>): ReactElement {
    return (
        <HStack
            align="center"
            className={cn(
                'box-border h-12 px-8 [grid-area:personlinje]',
                'border-b border-ax-border-neutral-strong bg-ax-bg-raised',
                'min-w-max whitespace-nowrap text-ax-text-neutral',
                '[&>span]:max-w-[200px] [&>svg]:mr-2',
                className,
            )}
        >
            {children}
        </HStack>
    );
}

function PersonHeaderContainer(): ReactElement | null {
    const isAnonymous = useIsAnonymous();
    const { loading, data } = useFetchPersonQuery();
    const person = data?.person;

    if (loading) {
        return <PersonHeaderSkeleton />;
    }

    if (!person) {
        return null;
    }

    return <PersonHeaderWithContent isAnonymous={isAnonymous} person={person} />;
}

function PersonHeaderSkeleton(): ReactElement {
    return (
        <PersonHeaderFrame>
            <GenderIcon gender={Kjonn.Ukjent} />
            <Skeleton variant="rectangle" width="200px" />
            <PersonHeaderSeparator />
            <Skeleton variant="rectangle" width="200px" />
            <PersonHeaderSeparator />
            <Skeleton variant="rectangle" width="200px" />
            <PersonHeaderSeparator />
            <Skeleton variant="rectangle" width="200px" />
            <HStack paddingInline="space-12 space-0" gap="space-12">
                <Skeleton variant="rectangle" width="6rem" />
            </HStack>
        </PersonHeaderFrame>
    );
}

function PersonHeaderError(): ReactElement {
    return (
        <PersonHeaderFrame className="bg-ax-bg-danger-soft">
            <BodyShort>Det oppstod en feil. Kan ikke vise personinformasjon.</BodyShort>
        </PersonHeaderFrame>
    );
}

export function PersonHeader(): ReactElement {
    return (
        <ErrorBoundary fallback={<PersonHeaderError />}>
            <PersonHeaderContainer />
        </ErrorBoundary>
    );
}
