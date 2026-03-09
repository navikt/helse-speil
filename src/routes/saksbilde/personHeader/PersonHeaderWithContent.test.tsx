import { Mock } from 'vitest';

import { Adressebeskyttelse, Kjonn } from '@io/graphql';
import { useGetBehandlendeEnhetForPerson } from '@io/rest/generated/person/person';
import { enPerson } from '@test-data/person';
import { render } from '@test-utils';
import { screen } from '@testing-library/react';

import { PersonHeaderWithContent } from './PersonHeaderWIthContent';

vi.mock('@io/rest/generated/person/person');

describe('Personlinje', () => {
    test('rendrer personinfo', async () => {
        (useGetBehandlendeEnhetForPerson as Mock).mockReturnValueOnce({
            data: {
                enhetNr: '1234',
                navn: 'Nav Andeby',
                type: 'LOKAL',
            },
        });
        render(
            <PersonHeaderWithContent
                isAnonymous={false}
                person={enPerson({
                    fodselsnummer: '12345678910',
                    aktorId: '123456789',
                    enhet: { __typename: 'Enhet', id: '301' },
                    personinfo: {
                        __typename: 'Personinfo',
                        fornavn: 'KORNELIUS',
                        mellomnavn: 'SA',
                        etternavn: 'KVAKK',
                        adressebeskyttelse: Adressebeskyttelse.Ugradert,
                        kjonn: Kjonn.Mann,
                        fullmakt: null,
                        unntattFraAutomatisering: {
                            __typename: 'UnntattFraAutomatiskGodkjenning',
                            erUnntatt: false,
                            arsaker: [],
                            tidspunkt: null,
                        },
                        fodselsdato: '1986-02-06',
                        automatiskBehandlingStansetAvSaksbehandler: false,
                    },
                    dodsdato: null,
                })}
            />,
        );
        expect(await screen.findByText('Kornelius Sa Kvakk', { exact: false })).toBeVisible();
        expect(await screen.findByText('123456 78910')).toBeVisible();
        expect(await screen.findByText('Aktør-ID: 123456789')).toBeVisible();
        expect(await screen.findByText('1234 - Nav Andeby')).toBeVisible();
    });
});
