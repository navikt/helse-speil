import React from 'react';
import { Flex } from '../../../components/Flex';
import { Sakslinje } from '../sakslinje/Sakslinje';
import '@navikt/helse-frontend-logg/lib/main.css';
import { LoggHeader } from '../Saksbilde';

export const TomtSaksbilde = () => (
    <Flex justifyContent="space-between" data-testid="tomt-saksbilde">
        <Sakslinje aktivVedtaksperiode={false} />
        <LoggHeader />
    </Flex>
);
