import { ApolloWrapper } from '@test-wrappers';

import { Adressebeskyttelse, Kjonn } from '@io/graphql';
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
                    unntattFraAutomatisering: {
                        erUnntatt: false,
                        arsaker: [],
                        tidspunkt: null,
                    },
                }}
                isAnonymous={false}
            />,
            { wrapper: ApolloWrapper },
        );
        expect(screen.getByText('Høiby, Marius Borg', { exact: false })).toBeVisible();
        expect(screen.getByText('123456 78910')).toBeVisible();
        expect(screen.getByText('123456789')).toBeVisible();
        expect(screen.getByText('Boenhet: 123 (Huttiheiti)')).toBeVisible();
    });
});
