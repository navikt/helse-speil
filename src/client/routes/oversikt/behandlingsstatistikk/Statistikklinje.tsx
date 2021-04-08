import { Flex } from '../../../components/Flex';
import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Progresjonsbar } from '@navikt/helse-frontend-progresjonsbar';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';

interface StatistikklinjeProps {
    etikett: ReactNode;
    upperBound: number;
    currentValue: number;
}

export const Statistikklinje = ({ etikett, upperBound, currentValue }: StatistikklinjeProps) => {
    const StyledProgresjonsbar = styled(Progresjonsbar)`
        height: 0.5rem;
        flex: 1;
    `;

    const StyledElement = styled(TekstMedEllipsis)`
        width: 35px;
        margin-right: 20px;
    `;

    return (
        <Flex alignItems={'center'} style={{ marginBottom: '.5rem' }}>
            <StyledElement>{currentValue}</StyledElement>
            {etikett}
            <StyledProgresjonsbar upperBound={upperBound} currentValue={currentValue} />
        </Flex>
    );
};
