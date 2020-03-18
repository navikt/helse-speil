import styled from '@emotion/styled';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import Grid from '../../components/Grid';

export const StyledIkkeVurderteVilkår = styled(Grid)`
    margin: 1rem 1.5rem;
    justify-content: start;
    border-bottom: 1px solid #c6c2bf;
    > div:not(:last-child) {
        margin-right: 14.5rem;
    }
`;

export const StyledUbehandletInnhold = styled(Grid)`
    margin: 1rem 2rem;
    justify-content: start;

    > *:not(:last-child) {
        margin-right: 15rem;
    }
`;

export const StyledBehandletInnhold = styled(BehandletInnhold)`
    margin: 2rem 4rem;
    width: max-content;

    div > *:not(:last-child) {
        margin-right: 11.1rem;
    }
`;
