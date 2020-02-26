import styled from '@emotion/styled';

export const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: start;

    &:not(:last-child) {
        margin-right: 6rem;
    }
`;
