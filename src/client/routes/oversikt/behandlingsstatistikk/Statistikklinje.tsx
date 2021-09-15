import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { Progresjonsbar } from '@navikt/helse-frontend-progresjonsbar';

import { Flex } from '../../../components/Flex';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';

const StyledProgresjonsbar = styled(Progresjonsbar)`
    height: 0.5rem;
    flex: 1;
`;

const Antall = styled(TekstMedEllipsis)`
    width: 35px;
    margin-right: 20px;
`;

const EtikettContainer = styled.span`
    margin-right: 20px;
`;

interface StatistikklinjeProps {
    etikett: ReactNode;
    upperBound: number;
    currentValue: number;
}

export const Statistikklinje = ({ etikett, upperBound, currentValue }: StatistikklinjeProps) => (
    <Flex alignItems="center" style={{ marginBottom: '.5rem' }}>
        <Antall>{currentValue}</Antall>
        <EtikettContainer>{etikett}</EtikettContainer>
        <StyledProgresjonsbar upperBound={upperBound} currentValue={currentValue} />
    </Flex>
);
