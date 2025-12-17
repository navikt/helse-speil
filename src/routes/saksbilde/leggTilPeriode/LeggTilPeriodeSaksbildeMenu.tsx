import classNames from 'classnames';
import Link from 'next/link';
import React, { ReactElement } from 'react';

import { BodyShort, Box, BoxProps, HStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import navLenkeStyles from '@saksbilde/saksbildeMenu/NavLenke.module.css';
import { DropdownMenu, LeggTilPeriodeDropdownMenuContent } from '@saksbilde/saksbildeMenu/dropdown/DropdownMenu';
import { useFetchPersonQuery } from '@state/person';

const LeggTilPeriodeSaksbildeMenuWrapper = (props: BoxProps) => (
    <Box
        paddingInline="4"
        borderWidth="0 0 1 0"
        borderColor="border-subtle"
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
                            className={classNames(navLenkeStyles.NavLink, navLenkeStyles.ActiveLink)}
                            href="#"
                            title="Legg til periode"
                        >
                            Legg til periode
                        </Link>
                        <DropdownMenu>
                            <LeggTilPeriodeDropdownMenuContent person={personData?.person ?? undefined} />
                        </DropdownMenu>
                    </HStack>
                </HStack>
            </LeggTilPeriodeSaksbildeMenuWrapper>
        </ErrorBoundary>
    );
};
