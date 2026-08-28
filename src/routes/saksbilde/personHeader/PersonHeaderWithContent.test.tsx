import { Mock } from 'vitest';

import {
    useGetBehandlendeEnhetForPerson,
    useGetKrrRegistrertStatusForPerson,
    useGetSaksbehandlerStans,
} from '@io/rest/generated/personer/personer';
import {
    ApiKrrRegistrertStatus,
    ApiPerson,
    ApiPersonAdressebeskyttelse,
    ApiPersonKjønn,
} from '@io/rest/generated/spesialist.schemas';
import { render } from '@test-utils';
import { screen } from '@testing-library/react';

import { PersonHeaderWithContent } from './PersonHeaderWithContent';

vi.mock('@io/rest/generated/personer/personer');

const enApiPerson: ApiPerson = {
    identitetsnummer: '12345678910',
    andreIdentitetsnumre: [],
    aktørId: '123456789',
    fornavn: 'KORNELIUS',
    mellomnavn: 'SA',
    etternavn: 'KVAKK',
    fødselsdato: '1986-02-06',
    dødsdato: null,
    kjønn: ApiPersonKjønn.MANN,
    adressebeskyttelse: ApiPersonAdressebeskyttelse.UGRADERT,
    fullmakt: null,
};

describe('Personlinje', () => {
    test('rendrer personinfo', async () => {
        (useGetBehandlendeEnhetForPerson as Mock).mockReturnValueOnce({
            data: {
                enhetNr: '1234',
                navn: 'Nav Andeby',
                type: 'LOKAL',
            },
        });
        (useGetSaksbehandlerStans as Mock).mockReturnValueOnce({
            data: {
                erStanset: false,
            },
        });
        (useGetKrrRegistrertStatusForPerson as Mock).mockReturnValueOnce({
            data: ApiKrrRegistrertStatus.RESERVERT_MOT_DIGITAL_KOMMUNIKASJON_ELLER_VARSLING,
        });
        render(<PersonHeaderWithContent isAnonymous={false} person={enApiPerson} />);
        expect(await screen.findByText('Kornelius Sa Kvakk', { exact: false })).toBeVisible();
        expect(await screen.findByText('123456 78910')).toBeVisible();
        expect(await screen.findByText('Aktør-ID: 123456789')).toBeVisible();
        expect(await screen.findByText('1234 - Nav Andeby')).toBeVisible();
        expect(await screen.findByText('Reservert KRR')).toBeVisible();
    });
});
