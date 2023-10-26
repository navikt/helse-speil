import React from 'react';

import { Pagination as NavPagination } from '@navikt/ds-react';

import { useInitializePagination, usePagination, useRefreshPagination, useSetPage } from './state/pagination';

import styles from './Pagination.module.css';

interface PaginationProps {
    numberOfEntries: number;
    numberOfPages: number;
    currentPage: number;
    limit: number;
    setPage: (newPage: number) => void;
}

export const Pagination = ({ numberOfEntries, numberOfPages, currentPage, limit, setPage }: PaginationProps) => (
    <div className={styles.Pagination}>
        <NavPagination page={currentPage} onPageChange={setPage} count={numberOfPages} siblingCount={2} prevNextTexts />
        {numberOfEntries > 0 && (
            <p>
                Viser {currentPage * limit - (limit - 1)} til{' '}
                {currentPage === numberOfPages && numberOfEntries % limit !== 0
                    ? currentPage * limit - (limit - (numberOfEntries % limit))
                    : currentPage * limit}{' '}
                av {numberOfEntries} oppgaver
            </p>
        )}
    </div>
);

interface BehandletIdagPaginationProps {
    numberOfEntries: number;
}

export const BehandletIdagPagination = ({ numberOfEntries }: BehandletIdagPaginationProps) => {
    const pagination = usePagination();
    const setPage = useSetPage();

    useInitializePagination(numberOfEntries);
    useRefreshPagination(numberOfEntries);

    if (!pagination) {
        return null;
    }

    const { currentPage, numberOfPages } = pagination;

    return (
        <div className={styles.Pagination}>
            <NavPagination
                page={currentPage}
                onPageChange={setPage}
                count={numberOfPages}
                siblingCount={2}
                prevNextTexts
            />
            {numberOfEntries > 0 && (
                <p>
                    Viser {pagination.firstVisibleEntry + 1} til{' '}
                    {pagination.lastVisibleEntry + 1 > numberOfEntries
                        ? numberOfEntries
                        : pagination.lastVisibleEntry + 1}{' '}
                    av {numberOfEntries} oppgaver
                </p>
            )}
        </div>
    );
};
