import React, { ReactElement } from 'react';

import { Pagination as NavPagination } from '@navikt/ds-react';

import { limit, offset, useCurrentPageState } from '@oversikt/table/state/pagination';

import styles from './Pagination.module.css';

interface PaginationProps {
    antallOppgaver: number;
    fetchMore: (offset: number) => void;
}

export const Pagination = ({ antallOppgaver, fetchMore }: PaginationProps): ReactElement => {
    const [currentPage, setCurrentPage] = useCurrentPageState();
    const numberOfPages = Math.ceil(antallOppgaver / limit) || 1;

    if (currentPage > numberOfPages) {
        setCurrentPage(numberOfPages);
    }

    return (
        <div className={styles.Pagination}>
            <NavPagination
                page={currentPage}
                onPageChange={(newPage: number) => {
                    setCurrentPage(newPage);
                    fetchMore(offset(newPage));
                }}
                count={numberOfPages}
                siblingCount={2}
                prevNextTexts
            />
            {antallOppgaver > 0 && (
                <p>
                    Viser {currentPage * limit - (limit - 1)} til{' '}
                    {currentPage === numberOfPages && antallOppgaver % limit !== 0
                        ? currentPage * limit - (limit - (antallOppgaver % limit))
                        : currentPage * limit}{' '}
                    av {antallOppgaver} oppgaver
                </p>
            )}
        </div>
    );
};
