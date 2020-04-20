import styled from '@emotion/styled';

export const Tabell = styled.table`
    width: 100%;
    text-align: left;
    margin: 1rem 0;
`;

export const Header = styled.th`
    height: 2rem;
    vertical-align: middle;

    .typo-undertekst {
        color: #3e3832;
        font-weight: 600;
    }
`;

export const Row = styled.tr`
    height: 50px;
    border-bottom: 1px solid #b7b1a9;
`;

export const Cell = styled.td`
    padding: 0.5rem 0;
`;
