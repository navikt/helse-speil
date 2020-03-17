import styled from '@emotion/styled';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import Grid from '../../components/Grid';

export const StyledUbehandletInnhold = styled(Grid)`
    margin: 1rem 2rem;
    justify-content: start;

    > *:not(:last-child) {
        margin-right: 5rem;
    }
`;

export const StyledBehandletInnhold = styled(BehandletInnhold)`
    margin: 2rem 4rem;
    width: max-content;
`;

export const YrkesskadeContainer = styled(Grid)`
    border-top: 1px solid #c6c2bf;
    border-bottom: 1px solid #c6c2bf;
    padding: 0 2rem;
`;
