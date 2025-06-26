import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { range } from 'remeda';

import { HStack, Skeleton } from '@navikt/ds-react';

import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { kanSeSelvstendigNæringsdrivende } from '@utils/featureToggles';

import { TabType, useAktivTab } from '../tabState';
import { Filter, Oppgaveoversiktkolonne } from '../table/state/filter';
import { FilterList } from './FilterList';
import { useSetFiltermenyWidth, useShowFiltermeny } from './state';

import styles from './Filtermeny.module.css';

interface FilterMenyProps {
    filters: Filter[];
}

export const Filtermeny = ({ filters }: FilterMenyProps): ReactElement => {
    const showFiltermeny = useShowFiltermeny();
    const settBredde = useSetFiltermenyWidth();
    const aktivTab = useAktivTab();

    return (
        <JusterbarSidemeny
            defaultBredde={280}
            visSidemeny={showFiltermeny}
            localStorageNavn="filterBredde"
            åpnesTilVenstre
            onChangeBredde={(width) => settBredde(width)}
        >
            <section className={classNames(styles.filtermeny)}>
                {aktivTab === TabType.TilGodkjenning && (
                    <FilterList
                        filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.TILDELING)}
                        text="Tildelt"
                    />
                )}
                {aktivTab === TabType.TilGodkjenning && (
                    <FilterList
                        filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.PÅVENT)}
                        text="På vent"
                    />
                )}
                <FilterList
                    filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.STATUS)}
                    text="Status"
                />
                <FilterList
                    filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.PERIODETYPE)}
                    text="Periodetype"
                />
                <FilterList
                    filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.OPPGAVETYPE)}
                    text="Oppgavetype"
                />
                <FilterList
                    filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.MOTTAKER)}
                    text="Mottaker"
                />
                <FilterList
                    filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.EGENSKAPER)}
                    text="Egenskaper"
                />
                {kanSeSelvstendigNæringsdrivende ? (
                    <>
                        <FilterList
                            filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.INNTEKTSFORHOLD)}
                            text="Inntektsforhold"
                        />
                        <FilterList
                            filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD)}
                            text="Antall inntektsforhold"
                        />
                    </>
                ) : (
                    <FilterList
                        filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD)}
                        text="Inntektskilde"
                    />
                )}
            </section>
        </JusterbarSidemeny>
    );
};

export function FiltermenySkeleton(): ReactElement {
    return (
        <HStack wrap={false}>
            <div className={classNames(styles.filtermeny, styles.filterskeleton)}>
                <SkeletonSection numberOfFilters={1} />
                <SkeletonSection numberOfFilters={1} />
                <SkeletonSection numberOfFilters={2} />
                <SkeletonSection numberOfFilters={3} />
                <SkeletonSection numberOfFilters={2} />
                <SkeletonSection numberOfFilters={4} />
                <SkeletonSection numberOfFilters={12} />
                <SkeletonSection numberOfFilters={2} />
            </div>
            <div className={styles.justerbarlinjeplaceholder} />
        </HStack>
    );
}

type SkeletonSectionProps = {
    numberOfFilters: number;
};

const SkeletonSection = ({ numberOfFilters }: SkeletonSectionProps): ReactElement => (
    <div className={styles.skeletonsection}>
        <Skeleton height={28} />
        {range(0, numberOfFilters).map((index) => (
            <HStack gap="2" wrap={false} key={index}>
                <Skeleton height={28} width={156} />
                <Skeleton height={28} width={24} />
                <Skeleton height={28} width={24} />
            </HStack>
        ))}
    </div>
);
