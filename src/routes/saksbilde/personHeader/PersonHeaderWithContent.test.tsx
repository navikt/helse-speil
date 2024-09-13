import { Adressebeskyttelse, Kjonn } from '@io/graphql';
import { enPerson } from '@test-data/person';
import { ApolloWrapper } from '@test-wrappers';
import { render, screen } from '@testing-library/react';

import { PersonHeaderWithContent } from './PersonHeaderWIthContent';

describe('Personlinje', () => {
    test('rendrer personinfo', () => {
        render(
            <PersonHeaderWithContent
                isAnonymous={false}
                person={enPerson({
                    fodselsnummer: '12345678910',
                    aktorId: '123456789',
                    enhet: { __typename: 'Enhet', id: '123', navn: 'Huttiheiti' },
                    personinfo: {
                        __typename: 'Personinfo',
                        fornavn: 'MARIUS',
                        mellomnavn: 'BORG',
                        etternavn: 'HØIBY',
                        adressebeskyttelse: Adressebeskyttelse.Ugradert,
                        kjonn: Kjonn.Mann,
                        fullmakt: null,
                        unntattFraAutomatisering: {
                            __typename: 'UnntattFraAutomatiskGodkjenning',
                            erUnntatt: false,
                            arsaker: [],
                            tidspunkt: null,
                        },
                        fodselsdato: null,
                        reservasjon: null,
                    },
                    dodsdato: null,
                })}
            />,
            { wrapper: ApolloWrapper },
        );
        expect(screen.getByText('Høiby, Marius Borg', { exact: false })).toBeVisible();
        expect(screen.getByText('123456 78910')).toBeVisible();
        expect(screen.getByText('123456789')).toBeVisible();
        expect(screen.getByText('Boenhet: 123 (Huttiheiti)')).toBeVisible();
    });
});
