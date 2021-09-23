import styled from '@emotion/styled';
import React from 'react';

import { Flex, FlexColumn } from '../../../components/Flex';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { Infotrygdikon } from '../../../components/ikoner/Infotrygdikon';

import { Tidslinjerad } from './Tidslinjerad';
import { InfotrygdradObject } from './useInfotrygdrader';

const Navn = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--navds-color-text-primary);
    line-height: 1rem;
    padding: 0 1rem 0 1.5rem;
    box-sizing: border-box;
    height: 24px;
    width: var(--tidslinje-rad-offset);
    max-width: var(--tidslinje-rad-offset);
`;

const Rader = styled(FlexColumn)`
    background-color: var(--speil-background-secondary);
    width: 100%;
    height: 100%;
    flex: 1;
`;

interface InfotrygdradProps {
    rad: InfotrygdradObject;
    navn: string;
}

export const Infotrygdrad = ({ rad, navn }: InfotrygdradProps) => (
    <Flex alignItems="start">
        <Navn>
            <Infotrygdikon />
            <TekstMedEllipsis data-tip={navn}>{navn}</TekstMedEllipsis>
        </Navn>
        <Rader>
            <Tidslinjerad rad={rad} erKlikkbar={false} />
        </Rader>
    </Flex>
);
