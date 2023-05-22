import { useLayoutEffect } from 'react';
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { TabType, tabState } from '../../tabState';

type Pagination = {
    entriesPerPage: number;
    currentPage: number;
    numberOfPages: number;
    firstVisibleEntry: number;
    lastVisibleEntry: number;
};

type PaginationPerTab = { [key in TabType]: Pagination | null };

const defaultPagination: Pagination = {
    currentPage: 1,
    entriesPerPage: 20,
    firstVisibleEntry: 0,
    lastVisibleEntry: 19,
    numberOfPages: 1,
};

const paginationPerTab = atom<PaginationPerTab>({
    key: 'paginationPerTab',
    default: {
        [TabType.TilGodkjenning]: defaultPagination,
        [TabType.Mine]: defaultPagination,
        [TabType.Ventende]: defaultPagination,
        [TabType.BehandletIdag]: defaultPagination,
    },
});

// @ts-ignore
const pagination = selector<Pagination | null>({
    key: 'pagination',
    get: ({ get }) => {
        const tab = get(tabState);
        return get(paginationPerTab)[tab];
    },
    set: ({ get, set }, newValue: Pagination | null) => {
        const tab = get(tabState);
        set(paginationPerTab, (pagination) => ({
            ...pagination,
            [tab]: newValue
                ? {
                      ...newValue,
                      firstVisibleEntry: (newValue.currentPage - 1) * newValue.entriesPerPage,
                      lastVisibleEntry:
                          (newValue.currentPage - 1) * newValue.entriesPerPage + newValue.entriesPerPage - 1,
                  }
                : null,
        }));
    },
});

export const usePagination = () => useRecoilValue(pagination);

export const useSetPagination = () => useSetRecoilState(pagination);

export const useInitializePagination = (numberOfEntries: number, entriesPerPage: number = 20) => {
    const pagination = usePagination();
    const setPagination = useSetPagination();
    useLayoutEffect(() => {
        if (!pagination) {
            setPagination({
                currentPage: 1,
                entriesPerPage: entriesPerPage,
                numberOfPages: Math.max(Math.ceil(numberOfEntries / entriesPerPage), 1),
                firstVisibleEntry: 0,
                lastVisibleEntry: entriesPerPage - 1,
            });
        }
    }, [pagination]);
};

export const useRefreshPagination = (numberOfEntries: number) => {
    const setPagination = useSetPagination();
    useLayoutEffect(() => {
        setPagination(
            (pagination) =>
                pagination && {
                    ...pagination,
                    numberOfPages: Math.max(Math.ceil(numberOfEntries / pagination.entriesPerPage), 1),
                },
        );
    }, [numberOfEntries]);
};

export const useSetPage = () => {
    const setPagination = useSetPagination();
    return (newPage: number) => {
        setPagination((pagination) => pagination && { ...pagination, currentPage: newPage });
    };
};
