import styled from '@emotion/styled';
import BehandletAvInfotrygd from '@navikt/helse-frontend-behandlet-av-infotrygd';
import { Grid } from '../../../components/Grid';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';

export const StyledUbehandletInnhold = styled(Grid)`
    justify-content: start;
`;

export const StyledBehandletInnhold = styled(BehandletVarsel)`
    margin: 2rem 4rem;
    width: max-content;
`;

export const StyledBehandletAvInfotrygd = styled(BehandletAvInfotrygd)`
    width: max-content;
`;

export const Vilkårinnhold = styled.div`
    margin: 2rem 2rem;
`;

export const Vilkårgrid = styled.span`
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
