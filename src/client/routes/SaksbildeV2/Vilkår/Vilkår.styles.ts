import styled from '@emotion/styled';
import { BehandletVarsel } from '@navikt/helse-frontend-varsel';
import { FlexColumn } from '../../../components/Flex';

export const StyledBehandletInnhold = styled(BehandletVarsel)`
    margin: 2rem 4rem;
    width: max-content;
`;

export const Vilkårkolonne = styled(FlexColumn)`
    > *:not(:last-child) {
        margin-bottom: 2rem;
    }
`;

export const Vilkårgrid = styled.span`
    grid-area: body;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 0.5rem;
    margin: 0 0 1rem 2rem;
`;

export const Strek = styled.hr`
    margin: 0;
    border: 0;
    height: 0;
    border-top: 1px solid #c6c2bf;
`;
