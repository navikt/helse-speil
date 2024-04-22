import { MemoryRouterWrapper } from '@test-wrappers';
import React from 'react';

import { Adressebeskyttelse, Kjonn } from '@io/graphql';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { PersonHeaderWithContent } from './PersonHeaderWIthContent';

describe('Personlinje', () => {
    test('rendrer personinfo', () => {
        render(
            <PersonHeaderWithContent
                fødselsnummer="12345678910"
                aktørId="123456789"
                enhet={{ id: '123', navn: 'Huttiheiti' }}
                personinfo={{
                    fornavn: 'MARIUS',
                    mellomnavn: 'BORG',
                    etternavn: 'HØIBY',
                    adressebeskyttelse: Adressebeskyttelse.Ugradert,
                    kjonn: Kjonn.Mann,
                    unntattFraAutomatiskGodkjenning: false,
                    unntattFraAutomatisering: {
                        erUntatt: false,
                        arsaker: [],
                        tidspunkt: null,
                    },
                }}
                isAnonymous={false}
            />,
            { wrapper: MemoryRouterWrapper },
        );
        expect(screen.getByText('Høiby, Marius Borg', { exact: false })).toBeVisible();
        expect(screen.getByText('123456 78910')).toBeVisible();
        expect(screen.getByText('123456789')).toBeVisible();
        expect(screen.getByText('Boenhet: 123 (Huttiheiti)')).toBeVisible();
    });
});
