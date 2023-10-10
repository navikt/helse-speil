import { useLayoutEffect } from 'react';
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { TabType, tabState } from '../../tabState';

export type Pagination = {
    entriesPerPage: number;
    currentPage: number;
    numberOfPages: number;
    firstVisibleEntry: number;
    lastVisibleEntry: number;
};

function isPagination(value: unknown): value is Pagination {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const pagination = value as Pagination;

    return (
        pagination.entriesPerPage !== undefined &&
        pagination.currentPage !== undefined &&
        pagination.numberOfPages !== undefined &&
        pagination.firstVisibleEntry !== undefined &&
        pagination.lastVisibleEntry !== undefined
    );
}

type PaginationPerTab = { [key in TabType]: Pagination | null };

const defaultPagination: Pagination = {
    currentPage: 1,
    entriesPerPage: 14,
    firstVisibleEntry: 0,
    lastVisibleEntry: 13,
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

const pagination = selector<Pagination | null>({
    key: 'pagination',
    get: ({ get }) => {
        const tab = get(tabState);
        return get(paginationPerTab)[tab];
    },
    set: ({ get, set }, newValue) => {
        const tab = get(tabState);
        set(paginationPerTab, (pagination) => ({
            ...pagination,
            [tab]: isPagination(newValue)
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

export const useInitializePagination = (numberOfEntries: number, entriesPerPage = 14) => {
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
        setPagination((pagination) => {
            if (!pagination) return null;
            const numberOfPages = Math.max(Math.ceil(numberOfEntries / pagination.entriesPerPage), 1);
            return {
                ...pagination,
                numberOfPages,
                currentPage: pagination.currentPage > numberOfPages ? numberOfPages : pagination.currentPage,
            };
        });
    }, [numberOfEntries]);
};

export const useSetPage = () => {
    const setPagination = useSetPagination();
    return (newPage: number) => {
        setPagination((pagination) => pagination && { ...pagination, currentPage: newPage });
    };
};
