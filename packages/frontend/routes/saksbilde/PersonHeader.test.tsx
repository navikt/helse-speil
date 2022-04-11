import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Adressebeskyttelse } from '@io/graphql';
import { MemoryRouterWrapper } from '@test-wrappers';

import { _PersonHeader } from './PersonHeader';

describe('Personlinje', () => {
    test('rendrer personinfo', () => {
        render(
            <_PersonHeader
                fødselsnummer="12345678910"
                aktørId="123456789"
                enhet={{ id: '123', navn: 'Huttiheiti' }}
                personinfo={{
                    fornavn: 'MARIUS',
                    mellomnavn: 'BORG',
                    etternavn: 'HØIBY',
                    adressebeskyttelse: Adressebeskyttelse.Ugradert,
                }}
                isAnonymous={false}
            />,
            { wrapper: MemoryRouterWrapper }
        );
        expect(screen.getByText('Høiby, Marius Borg', { exact: false })).toBeVisible();
        expect(screen.getByText('123456 78910')).toBeVisible();
        expect(screen.getByText('123456789')).toBeVisible();
        expect(screen.getByText('Boenhet: 123 (Huttiheiti)')).toBeVisible();
    });
});
