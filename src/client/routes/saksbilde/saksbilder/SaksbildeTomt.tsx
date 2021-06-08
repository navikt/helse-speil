import React from 'react';

import '@navikt/helse-frontend-logg/lib/main.css';

import { Flex } from '../../../components/Flex';

import { SakslinjeForTomtSaksbilde } from '../sakslinje/Sakslinje';
import { LoggHeader } from './Logg';

export const TomtSaksbilde = () => (
    <Flex justifyContent="space-between" data-testid="tomt-saksbilde">
        <SakslinjeForTomtSaksbilde />
        <LoggHeader />
    </Flex>
);
