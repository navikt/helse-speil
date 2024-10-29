import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { BodyShort, Box, BoxProps, HStack, Skeleton } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { PersonFragment } from '@io/graphql';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode, isTilkommenInntekt, isUberegnetPeriode } from '@utils/typeguards';

import { DropdownMenu } from './dropdown/DropdownMenu';

import styles from './SaksbildeMenu.module.css';

type SaksbildeMenuProps = {
    person: PersonFragment;
    activePeriod: ActivePeriod;
};

const NavLenke = ({ tittel, to }: { tittel: string; to: string }): ReactElement => {
    const tab = last(usePathname().split('/'));
    return (
        <Link
            className={classNames(styles.NavLink, { [styles.ActiveLink]: decodeURI(tab ?? '') === to })}
            href={to}
            title={tittel}
        >
            {tittel}
        </Link>
    );
};

const SaksbildeMenuContainer = ({ person, activePeriod }: SaksbildeMenuProps): ReactElement => {
    const erBeregnetPeriode = isBeregnetPeriode(activePeriod);
    const erPeriode = erBeregnetPeriode || isUberegnetPeriode(activePeriod);
    const erVilkårsvurdert = erBeregnetPeriode || isGhostPeriode(activePeriod);
    const harRisikofunn =
        erBeregnetPeriode && activePeriod.risikovurdering?.funn && activePeriod.risikovurdering?.funn?.length > 0;
    const harTilkommenInntekt = harTilkommenInntektPåSkjæringstidspunkt(person, activePeriod.skjaeringstidspunkt);
    return (
        <SaksbildeMenuWrapper>
            <HStack>
                <HStack as="nav" role="tablist">
                    {erPeriode && <NavLenke to="dagoversikt" tittel="Dagoversikt" />}
                    {erBeregnetPeriode && <NavLenke to="inngangsvilkår" tittel="Inngangsvilkår" />}
                    {erVilkårsvurdert && <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" />}
                    {harRisikofunn && <NavLenke to="vurderingsmomenter" tittel="Vurderingsmomenter" />}
                    {harTilkommenInntekt && <NavLenke to="tilkommen-inntekt" tittel="Tilkommen inntekt" />}
                </HStack>
                <DropdownMenu person={person} activePeriod={activePeriod} />
            </HStack>
        </SaksbildeMenuWrapper>
    );
};

export const SaksbildemenySkeleton = () => (
    <SaksbildeMenuWrapper>
        <HStack gap="4">
            <Skeleton>
                <NavLenke to="dagoversikt" tittel="Dagoversikt" />
            </Skeleton>

            <Skeleton>
                <NavLenke to="inngangsvilkår" tittel="Inngangsvilkår" />
            </Skeleton>
            <Skeleton>
                <NavLenke to="sykepengegrunnlag" tittel="Sykepengegrunnlag" />
            </Skeleton>
            <Skeleton>
                <NavLenke to="tilkommen-inntekt" tittel="Tilkommen inntekt" />
            </Skeleton>
            <Skeleton width="90px" />
        </HStack>
    </SaksbildeMenuWrapper>
);

const SaksbildeMenuError = (): ReactElement => (
    <SaksbildeMenuWrapper background="surface-danger-subtle">
        <HStack height="100%" align="center">
            <BodyShort>Det oppstod en feil. Kan ikke vise saksbildemeny.</BodyShort>
        </HStack>
    </SaksbildeMenuWrapper>
);

const SaksbildeMenuWrapper = (props: BoxProps) => (
    <Box paddingInline="4" borderWidth="0 0 1 0" borderColor="border-subtle" height="3rem" {...props} />
);

export const SaksbildeMenu = (props: SaksbildeMenuProps): ReactElement => (
    <ErrorBoundary fallback={<SaksbildeMenuError />}>
        <SaksbildeMenuContainer {...props} />
    </ErrorBoundary>
);

const harTilkommenInntektPåSkjæringstidspunkt = (person: PersonFragment, skjæringstidspunkt: string) =>
    person.arbeidsgivere.flatMap((ag) =>
        ag.nyeInntektsforholdPerioder.filter(
            (it) => isTilkommenInntekt(it) && it.skjaeringstidspunkt === skjæringstidspunkt,
        ),
    ).length > 0;
