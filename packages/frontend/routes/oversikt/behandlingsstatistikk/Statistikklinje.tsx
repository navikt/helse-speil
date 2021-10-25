import styled from '@emotion/styled';
import React, { ReactNode } from 'react';

import { Flex } from '../../../components/Flex';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';

const Antall = styled(TekstMedEllipsis)`
    width: 35px;
    margin-right: 20px;
`;

const EtikettContainer = styled.span`
    margin-right: 20px;
`;

const Progress = styled.progress`
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    height: 0.5rem;

    ::-webkit-progress-bar {
        background-color: var(--navds-color-gray-10);
        color: #3484d1;
    }

    ::-moz-progress-bar {
        background-color: #3484d1;
    }

    ::-webkit-progress-value {
        background-color: #3484d1;
    }
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
        <Progress value={currentValue} max={upperBound} />
    </Flex>
);
