import styled from '@emotion/styled';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import Grid from '../../components/Grid';

export const StyledUbehandletInnhold = styled(Grid)`
    margin: 1rem 2rem;
    justify-content: start;
`;

export const StyledBehandletInnhold = styled(BehandletInnhold)`
    margin: 2rem 4rem;
    width: max-content;
`;

export const Strek = styled.hr`
    border: 0;
    height: 0;
    border-top: 1px solid #c6c2bf;
`;
