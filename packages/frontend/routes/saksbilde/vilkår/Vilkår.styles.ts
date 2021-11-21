import styled from '@emotion/styled';

export const Vilkårkolonne = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const Vilkårgruppe = styled.li`
    &:not(:last-of-type) {
        margin-bottom: 2rem;
    }
`;

export const Vilkårgrid = styled.div`
    grid-area: body;
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 0.25rem;
    margin: 0 0 2rem 2.5rem;

    &:last-of-type {
        margin-bottom: 1rem;
    }
`;

export const BehandletVarselContent = styled(Vilkårkolonne)`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

export const IkonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
    width: 2.5rem;
    min-height: 1.5rem;
`;
