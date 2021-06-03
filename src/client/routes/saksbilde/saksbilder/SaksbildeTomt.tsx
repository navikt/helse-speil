import React from 'react';

import '@navikt/helse-frontend-logg/lib/main.css';

import { Flex } from '../../../components/Flex';

import { LoggHeader } from '../Saksbilde';
import { Sakslinje, SakslinjeForTomtSaksbilde } from '../sakslinje/Sakslinje';

export const TomtSaksbilde = () => (
    <Flex justifyContent="space-between" data-testid="tomt-saksbilde">
        <SakslinjeForTomtSaksbilde />
        <LoggHeader />
    </Flex>
);
