import React, { ReactElement, useEffect } from 'react';

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

    useEffect(() => {
        if (currentPage > numberOfPages) {
            setCurrentPage(numberOfPages);
        }
    }, [setCurrentPage, currentPage, numberOfPages]);

    const firstOnPage = (currentPage - 1) * limit + 1;
    const isLastPage = currentPage === numberOfPages;
    const remainder = antallOppgaver % limit;
    const itemsOnPage = isLastPage && remainder !== 0 ? remainder : limit;
    const lastOnPage = firstOnPage + itemsOnPage - 1;

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
                    Viser {firstOnPage} til {lastOnPage} av {antallOppgaver} oppgaver
                </p>
            )}
        </div>
    );
};
