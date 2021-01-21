import styled from '@emotion/styled';
import { FlexColumn } from '../../../components/Flex';

export const BehandletVarselContent = styled.div`
    padding-top: 1rem;
`;

export const Vilkårkolonne = styled(FlexColumn)`
    max-width: 480px;
    min-width: 480px;
    &:not(:last-of-type) {
        margin-right: 1rem;
    }
`;

export const Vilkårgrid = styled.span`
    grid-area: body;
    display: grid;
    grid-template-columns: 2fr auto;
    grid-gap: 0.25rem;
    margin: 0 0 2rem 2.5rem;
`;

export const Strek = styled.hr`
    margin: 0;
    border: 0;
    height: 0;
    border-top: 1px solid #c6c2bf;
`;
