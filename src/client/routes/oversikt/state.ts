import { useEffect, useLayoutEffect } from 'react';
import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';

import { Filtrering } from '@navikt/helse-frontend-tabell/lib/src/filtrering';
import { Sortering } from '@navikt/helse-frontend-tabell/lib/src/sortering';
import { UseTabellFiltrering } from '@navikt/helse-frontend-tabell/lib/src/useTabell';
import { Filter } from '@navikt/helse-frontend-tabell/src/filtrering';

import { tabState, TabType, useAktivTab } from './tabs';

export const sorteringState = atom<Sortering | undefined>({
    key: 'oversiktstabellState',
    default: undefined,
});

type TabFiltrering = {
    type: TabType;
    filtere: {
        filter: Filter;
        kolonne: number;
        active: boolean;
    }[];
}[];

const filterCacheState = atom<TabFiltrering>({
    key: 'filterCacheState',
    default: [
        { type: 'alle', filtere: [] },
        { type: 'mine', filtere: [] },
        { type: 'ventende', filtere: [] },
    ],
});

export const filtreringState = selector<Filtrering | undefined>({
    key: 'filtreringState',
    get: ({ get }) => {
        const aktivTab = get(tabState);
        const cache = get(filterCacheState);
        return cache.find((it) => it.type === aktivTab && it.filtere?.length > 0);
    },
    set: ({ set, get }, newValue) => {
        const aktivTab = get(tabState);
        set(filterCacheState, (cache) => cache.map((it) => (it.type === aktivTab ? { ...it, ...newValue } : it)));
    },
});

export const useOppdaterDefaultSortering = (sortering: Sortering) => {
    const setDefaultSortering = useSetRecoilState(sorteringState);
    useEffect(() => {
        setDefaultSortering(sortering);
    }, [sortering]);
};

const filtreringerErLike = (a: Filtrering, b: Filtrering) =>
    a.filtere.every(
        (it, i) =>
            it.kolonne === b.filtere[i].kolonne &&
            it.active === b.filtere[i].active &&
            it.filter.label === b.filtere[i].filter.label &&
            it.filter.func.toString() === b.filtere[i].filter.func.toString()
    );

export const useOppdaterDefaultFiltrering = (filtrering: Filtrering) => {
    const [defaultFiltrering, setDefaultFiltrering] = useRecoilState(filtreringState);
    useEffect(() => {
        if (!defaultFiltrering || !filtreringerErLike(defaultFiltrering, filtrering)) {
            setDefaultFiltrering({ filtere: filtrering.filtere });
        }
    }, [filtrering, defaultFiltrering]);
};

export const useOppdatertFiltreringVedFanebytte = (filtrering: UseTabellFiltrering) => {
    const aktivTab = useAktivTab();

    useLayoutEffect(() => {
        switch (aktivTab) {
            case 'alle':
                filtrering.set((filtrering: Filtrering) => ({
                    ...filtrering,
                    filtere: filtrering?.filtere.map((it) => ({
                        ...it,
                        active: it.filter.label === 'Ufordelte saker' ? true : it.active,
                    })),
                }));
                break;
            case 'ventende':
            case 'mine':
                filtrering.set((filtrering: Filtrering) => ({
                    ...filtrering,
                    filtere: filtrering?.filtere.map((it) => ({
                        ...it,
                        active: it.filter.label === 'Ufordelte saker' ? false : it.active,
                    })),
                }));
                break;
        }
    }, [aktivTab]);
};
