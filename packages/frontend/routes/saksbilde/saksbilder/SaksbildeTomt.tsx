import React from 'react';

import { Flex } from '../../../components/Flex';

import { SakslinjeForTomtSaksbilde } from '../sakslinje/Sakslinje';

export const TomtSaksbilde = () => (
    <Flex justifyContent="space-between" data-testid="tomt-saksbilde">
        <SakslinjeForTomtSaksbilde />
    </Flex>
);
