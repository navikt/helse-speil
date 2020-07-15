import styled from '@emotion/styled';
import BehandletInnhold from '@navikt/helse-frontend-behandlet-innhold';
import TwoColumnGrid from '../../../components/TwoColumnGrid';
import BehandletAvInfotrygd from '@navikt/helse-frontend-behandlet-av-infotrygd';

export const StyledUbehandletInnhold = styled(TwoColumnGrid)`
    justify-content: start;
`;

export const StyledBehandletInnhold = styled(BehandletInnhold)`
    margin: 2rem 4rem;
    width: max-content;
`;

export const StyledBehandletAvInfotrygd = styled(BehandletAvInfotrygd)`
    width: max-content;
`;

export const Vilkårinnhold = styled.div`
    margin: 2rem 2rem;
`;

export const Grid = styled.span`
    grid-area: body;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
    margin: 0 0 0 2rem;
`;

export const Strek = styled.hr`
    margin 0;
    border: 0;
    height: 0;
    border-top: 1px solid #c6c2bf;
`;
