import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { useSetRecoilState } from 'recoil';
import { range } from 'remeda';

import { HStack, Skeleton } from '@navikt/ds-react';

import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';

import { TabType, useAktivTab } from '../tabState';
import { Filter, Oppgaveoversiktkolonne } from '../table/state/filter';
import { FilterList } from './FilterList';
import { filtermenyWidth, useShowFiltermeny } from './state';

import styles from './Filtermeny.module.css';

interface FilterMenyProps {
    filters: Filter[];
}

export const Filtermeny = ({ filters }: FilterMenyProps): ReactElement => {
    const showFiltermeny = useShowFiltermeny();
    const settBredde = useSetRecoilState(filtermenyWidth);
    const aktivTab = useAktivTab();

    return (
        <JusterbarSidemeny
            defaultBredde={320}
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
                {(aktivTab === TabType.TilGodkjenning || aktivTab === TabType.Mine) && (
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
                <FilterList
                    filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.ANTALLARBEIDSFORHOLD)}
                    text="Inntekskilde"
                />
            </section>
        </JusterbarSidemeny>
    );
};

export function FiltermenySkeleton(): ReactElement {
    return (
        <div className={classNames(styles.filtermeny, styles.filterSkeleton)}>
            <SkeletonSection numberOfFilters={2} />
            <SkeletonSection numberOfFilters={2} />
            <SkeletonSection numberOfFilters={2} />
            <SkeletonSection numberOfFilters={3} />
            <SkeletonSection numberOfFilters={2} />
            <SkeletonSection numberOfFilters={4} />
            <SkeletonSection numberOfFilters={8} />
            <SkeletonSection numberOfFilters={2} />
        </div>
    );
}

type SkeletonSectionProps = {
    numberOfFilters: number;
};

const SkeletonSection = ({ numberOfFilters }: SkeletonSectionProps): ReactElement => (
    <div className={styles.skeletonSection}>
        <Skeleton height={28} className={styles.topSkeleton} />
        {range(0, numberOfFilters).map((index) => (
            <HStack gap="4" wrap={false} key={index}>
                <Skeleton height={28} width={28} />
                <Skeleton height={28} width="100%" />
            </HStack>
        ))}
    </div>
);
