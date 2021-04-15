import React from 'react';
import { Flex } from '../../../components/Flex';
import { Tidslinje } from '../../../components/tidslinje';
import { Personlinje } from '../../../components/Personlinje';
import { LoggProvider } from '../logg/LoggProvider';
import { Sakslinje } from '../sakslinje/Sakslinje';
import { Person } from 'internal-types';
import '@navikt/helse-frontend-logg/lib/main.css';
import { LoggHeader, SaksbildeContainer } from '../Saksbilde';

export const TomtSaksbilde = ({ person }: { person: Person }) => (
    <SaksbildeContainer className="saksbilde" data-testid="tomt-saksbilde">
        <LoggProvider>
            <Personlinje person={person} />
            <Tidslinje person={person} />
            <Flex justifyContent="space-between">
                <Sakslinje aktivVedtaksperiode={false} />
                <LoggHeader />
            </Flex>
        </LoggProvider>
    </SaksbildeContainer>
);
