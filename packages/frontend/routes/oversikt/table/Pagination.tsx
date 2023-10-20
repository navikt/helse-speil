import React from 'react';

import { Pagination as NavPagination } from '@navikt/ds-react';

import { useInitializePagination, usePagination, useRefreshPagination, useSetPage } from './state/pagination';

import styles from './Pagination.module.css';

interface PaginationProps {
    numberOfEntries: number;
}

export const Pagination = ({ numberOfEntries }: PaginationProps) => {
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
