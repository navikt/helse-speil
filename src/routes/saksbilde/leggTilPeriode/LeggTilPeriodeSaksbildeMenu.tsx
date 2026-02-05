import Link from 'next/link';
import React, { ReactElement } from 'react';

import { BodyShort, Box, BoxProps, HStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import navLenkeStyles from '@saksbilde/saksbildeMenu/NavLenke.module.css';
import { LitenMeny } from '@saksbilde/saksbildeMenu/dropdown/DropdownMenu';
import { useFetchPersonQuery } from '@state/person';
import { cn } from '@utils/tw';

const LeggTilPeriodeSaksbildeMenuWrapper = (props: BoxProps) => (
    <Box
        paddingInline="space-16"
        borderWidth="0 0 1 0"
        borderColor="neutral-subtle"
        height="3rem"
        overflow="hidden"
        {...props}
    />
);

const LeggTilPeriodeSaksbildeMenuError = (): ReactElement => (
    <LeggTilPeriodeSaksbildeMenuWrapper background-color="surface-danger-subtle">
        <HStack height="100%" align="center">
            <BodyShort>Det oppstod en feil. Kan ikke vise saksbildemeny.</BodyShort>
        </HStack>
    </LeggTilPeriodeSaksbildeMenuWrapper>
);

export const LeggTilPeriodeSaksbildeMenu = (): ReactElement => {
    const { data: personData } = useFetchPersonQuery();
    return (
        <ErrorBoundary fallback={<LeggTilPeriodeSaksbildeMenuError />}>
            <LeggTilPeriodeSaksbildeMenuWrapper>
                <HStack>
                    <HStack as="nav" role="tablist">
                        <Link
                            className={cn(navLenkeStyles.NavLink, navLenkeStyles.ActiveLink)}
                            href="#"
                            title="Legg til periode"
                        >
                            Legg til periode
                        </Link>
                        <LitenMeny person={personData?.person} />
                    </HStack>
                </HStack>
            </LeggTilPeriodeSaksbildeMenuWrapper>
        </ErrorBoundary>
    );
};
