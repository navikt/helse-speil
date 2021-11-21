import styled from '@emotion/styled';
import React from 'react';

import {
    useInitializePagination,
    usePagination,
    useRefreshPagination,
    useSetPage,
    useToNextPage,
    useToPreviousPage,
} from './state/pagination';

import { generatePageNumbers } from './sidetall';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
`;

const ButtonsContainer = styled.div`
    margin: 0.5rem;

    > button:not(:last-of-type) {
        margin-right: 0.5rem;
    }
`;

const PageButton = styled.button<{ active?: boolean }>`
    border: none;
    background: none;
    border-radius: 0.25rem;
    font-family: Source Sans Pro, sans-serif;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    min-width: 2rem;

    &:focus {
        box-shadow: 0 0 0 3px var(--navds-text-focus);
    }

    &:hover && :not(:disabled) {
        color: var(--navds-color-text-inverse);
        background: var(--navds-color-action-default);
    }

    &:active {
        color: var(--navds-color-text-inverse);
        background: var(--navds-text-focus);
    }

    ${({ active }) =>
        active &&
        `
        background: var(--navds-color-action-default);
        color: var(--navds-color-text-inverse);
        `}
`;

interface PaginationProps {
    numberOfEntries: number;
}

export const Pagination = ({ numberOfEntries }: PaginationProps) => {
    const pagination = usePagination();
    const setPage = useSetPage();
    const toNextPage = useToNextPage();
    const toPreviousPage = useToPreviousPage();

    useInitializePagination(numberOfEntries);
    useRefreshPagination(numberOfEntries);

    if (!pagination) {
        return null;
    }

    const { currentPage, entriesPerPage, numberOfPages } = pagination;

    return (
        <Container>
            <ButtonsContainer>
                <PageButton disabled={currentPage === 1} onClick={toPreviousPage}>
                    Forrige
                </PageButton>
                {generatePageNumbers(currentPage, numberOfPages, 9).map((element) =>
                    isNaN(element) ? (
                        <PageButton key={element}>{element}</PageButton>
                    ) : (
                        <PageButton onClick={() => setPage(element)} active={currentPage === element} key={element}>
                            {element}
                        </PageButton>
                    )
                )}
                <PageButton
                    disabled={numberOfEntries <= entriesPerPage || currentPage === numberOfPages}
                    onClick={toNextPage}
                >
                    Neste
                </PageButton>
            </ButtonsContainer>
            <p>
                Viser {pagination.firstVisibleEntry + 1} til{' '}
                {pagination.lastVisibleEntry + 1 > numberOfEntries ? numberOfEntries : pagination.lastVisibleEntry + 1}{' '}
                av {numberOfEntries} oppgaver
            </p>
        </Container>
    );
};
