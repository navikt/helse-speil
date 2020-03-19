import styled from '@emotion/styled';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import TwoColumnGrid from '../../components/TwoColumnGrid';

export const StyledUbehandletInnhold = styled(TwoColumnGrid)`
    margin: 1rem 2rem;
    justify-content: start;
`;

export const StyledBehandletInnhold = styled(BehandletInnhold)`
    margin: 2rem 4rem;
    width: max-content;
`;
