import classNames from 'classnames';
import React from 'react';
import { useSetRecoilState } from 'recoil';

import { JusterbarSidemeny } from '@components/justerbarSidemeny/JusterbarSidemeny';
import { fellesPåVentBenk } from '@utils/featureToggles';

import { TabType, useAktivTab } from '../tabState';
import { Filter, Oppgaveoversiktkolonne } from '../table/state/filter';
import { FilterList } from './FilterList';
import { filtermenyWidth, useShowFiltermeny } from './state';

import styles from './Filtermeny.module.css';

interface FilterMenyProps {
    filters: Filter[];
}
export const Filtermeny = ({ filters }: FilterMenyProps) => {
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
                    <>
                        <FilterList
                            filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.TILDELING)}
                            text="Tildelt"
                        />
                        {fellesPåVentBenk && (
                            <FilterList
                                filters={filters.filter((it) => it.column === Oppgaveoversiktkolonne.PÅVENT)}
                                text="På vent"
                            />
                        )}
                    </>
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
