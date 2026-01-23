import React, { ReactElement } from 'react';

import { BodyShort, Box, BoxProps, HStack, Skeleton } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { PersonFragment } from '@io/graphql';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode, isUberegnetPeriode } from '@utils/typeguards';

import { NavLenke, NavLenkeSkeleton } from './NavLenke';
import { DropdownMenu, DropdownMenuContent } from './dropdown/DropdownMenu';

type SaksbildeMenuProps = {
    person: PersonFragment;
    activePeriod: ActivePeriod;
};

const SaksbildeMenuContainer = ({ person, activePeriod }: SaksbildeMenuProps): ReactElement => {
    const erBeregnetPeriode = isBeregnetPeriode(activePeriod);
    const erPeriode = erBeregnetPeriode || isUberegnetPeriode(activePeriod);
    const erVilkårsvurdert = erBeregnetPeriode || isGhostPeriode(activePeriod);
    const harRisikofunn =
        erBeregnetPeriode && activePeriod.risikovurdering?.funn && activePeriod.risikovurdering?.funn?.length > 0;
    return (
        <SaksbildeMenuWrapper>
            <HStack>
                <HStack as="nav" role="tablist">
                    {erPeriode && <NavLenke to="dagoversikt" tittel="Dagoversikt" />}
                    {erBeregnetPeriode && <NavLenke to="inngangsvilkår" tittel="Inngangsvilkår" />}
                    {erVilkårsvurdert && <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" />}
                    {harRisikofunn && <NavLenke to="vurderingsmomenter" tittel="Vurderingsmomenter" />}
                </HStack>
                <DropdownMenu>
                    <DropdownMenuContent person={person} activePeriod={activePeriod} />
                </DropdownMenu>
            </HStack>
        </SaksbildeMenuWrapper>
    );
};

const SaksbildeMenuWrapper = (props: BoxProps) => (
    <Box
        paddingInline="space-16"
        borderWidth="0 0 1 0"
        borderColor="neutral-subtle"
        height="3rem"
        overflow="hidden"
        {...props}
    />
);

export const SaksbildemenySkeleton = () => (
    <SaksbildeMenuWrapper>
        <HStack gap="space-20" paddingInline="space-20">
            <NavLenkeSkeleton tittel="Dagoversikt" />
            <NavLenkeSkeleton tittel="Inngangsvilkår" />
            <NavLenkeSkeleton tittel="Sykepengegrunnlag" />
            <NavLenkeSkeleton tittel="Tilkommen inntekt" />
            <Skeleton width="90px" />
        </HStack>
    </SaksbildeMenuWrapper>
);

const SaksbildeMenuError = (): ReactElement => (
    <SaksbildeMenuWrapper background-color="surface-danger-subtle">
        <HStack height="100%" align="center">
            <BodyShort>Det oppstod en feil. Kan ikke vise saksbildemeny.</BodyShort>
        </HStack>
    </SaksbildeMenuWrapper>
);

export const SaksbildeMenu = (props: SaksbildeMenuProps): ReactElement => (
    <ErrorBoundary fallback={<SaksbildeMenuError />}>
        <SaksbildeMenuContainer {...props} />
    </ErrorBoundary>
);
