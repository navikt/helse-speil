import styled from '@emotion/styled';

interface CellProps {
    widthInPixels?: number;
}

export const Tabell = styled.table`
    text-align: left;
    margin: 1rem 0;
    table-layout: fixed;
    width: calc(100vw - 4.125rem);
    min-width: 1000px;
`;

export const HeaderView = styled.th`
    height: 2rem;
    vertical-align: middle;

    .typo-undertekst {
        color: #3e3832;
        font-weight: 600;
    }

    width: auto;
    ${({ widthInPixels }: CellProps) => widthInPixels && `width: ${widthInPixels}px;`}
`;

export const Row = styled.tr`
    height: 50px;
    border-bottom: 1px solid #b7b1a9;
`;

export const Cell = styled.td`
    padding: 0.5rem 0;
    min-width: max-content;
    vertical-align: middle;
    white-space: nowrap;

    &:not(:last-of-type) {
        padding-right: 1rem;
    }
`;

export const Flex = styled.span`
    display: flex;
    align-items: center;
`;
