import React, { ReactElement } from 'react';

import { Pagination as NavPagination } from '@navikt/ds-react';

import styles from './Pagination.module.css';

interface PaginationProps {
    numberOfEntries: number;
    numberOfPages: number;
    currentPage: number;
    limit: number;
    setPage: (newPage: number) => void;
}

export const Pagination = ({
    numberOfEntries,
    numberOfPages,
    currentPage,
    limit,
    setPage,
}: PaginationProps): ReactElement => (
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
