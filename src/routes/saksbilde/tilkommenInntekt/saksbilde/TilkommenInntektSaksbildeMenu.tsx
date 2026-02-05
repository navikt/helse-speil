import Link from 'next/link';
import React, { ReactElement } from 'react';

import { BodyShort, Box, BoxProps, HStack } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import navLenkeStyles from '@saksbilde/saksbildeMenu/NavLenke.module.css';
import { LitenMeny } from '@saksbilde/saksbildeMenu/dropdown/DropdownMenu';
import { useFetchPersonQuery } from '@state/person';
import { cn } from '@utils/tw';

const TilkommenInntektSaksbildeMenuWrapper = (props: BoxProps) => (
    <Box
        paddingInline="space-16"
        borderWidth="0 0 1 0"
        borderColor="neutral-subtle"
        height="3rem"
        overflow="hidden"
        {...props}
    />
);

const TilkommenInntektSaksbildeMenuError = (): ReactElement => (
    <TilkommenInntektSaksbildeMenuWrapper background-color="surface-danger-subtle">
        <HStack height="100%" align="center">
            <BodyShort>Det oppstod en feil. Kan ikke vise saksbildemeny.</BodyShort>
        </HStack>
    </TilkommenInntektSaksbildeMenuWrapper>
);

export const TilkommenInntektSaksbildeMenu = (): ReactElement => {
    const { data: personData } = useFetchPersonQuery();
    return (
        <ErrorBoundary fallback={<TilkommenInntektSaksbildeMenuError />}>
            <TilkommenInntektSaksbildeMenuWrapper>
                <HStack>
                    <HStack as="nav" role="tablist">
                        <Link
                            className={cn(navLenkeStyles.NavLink, navLenkeStyles.ActiveLink)}
                            href="#"
                            title="Tilkommen inntekt"
                        >
                            Tilkommen inntekt
                        </Link>
                        <LitenMeny person={personData?.person} />
                    </HStack>
                </HStack>
            </TilkommenInntektSaksbildeMenuWrapper>
        </ErrorBoundary>
    );
};
