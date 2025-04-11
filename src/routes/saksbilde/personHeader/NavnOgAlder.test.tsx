import dayjs from 'dayjs';

import { render } from '@/test/test-utils';
import { Adressebeskyttelse, Kjonn, Personinfo } from '@io/graphql';
import { NavnOgAlder } from '@saksbilde/personHeader/NavnOgAlder';
import { cleanup, screen } from '@testing-library/react';

describe('NavnOgAlder', () => {
    test('rendrer ok', () => {
        render(<NavnOgAlder personinfo={defaultPersoninfo} dodsdato={null} />);
        expect(screen.getByText('Bruce Batman Wayne (49 år)')).toBeVisible();
    });

    test('Regner alder ut fra fødselsdato', () => {
        const fodselsdato = '1978-06-14';
        render(<NavnOgAlder personinfo={{ ...defaultPersoninfo, fodselsdato }} dodsdato={null} />);
        const antallÅrMellomFødselsdatoOgNå = dayjs().diff(fodselsdato, 'year');
        expect(screen.getByText(`(${antallÅrMellomFødselsdatoOgNå} år)`, { exact: false })).toBeVisible();
    });

    test('viser riktig alder etter dødsfall', () => {
        const fodselsdato = '1980-02-01';
        render(<NavnOgAlder personinfo={{ ...defaultPersoninfo, fodselsdato }} dodsdato="2022-01-31" />);
        expect(screen.getByText('(41 år)', { exact: false })).toBeVisible();
        cleanup();
        render(<NavnOgAlder personinfo={{ ...defaultPersoninfo, fodselsdato }} dodsdato="2022-02-01" />);
        expect(screen.getByText('(42 år)', { exact: false })).toBeVisible();
    });
});

const defaultPersoninfo: Personinfo = {
    __typename: 'Personinfo',
    fornavn: 'BRUCE',
    mellomnavn: 'BATMAN',
    etternavn: 'WAYNE',
    adressebeskyttelse: Adressebeskyttelse.Ugradert,
    kjonn: Kjonn.Mann,
    fullmakt: null,
    unntattFraAutomatisering: {
        __typename: 'UnntattFraAutomatiskGodkjenning',
        erUnntatt: false,
        arsaker: [],
        tidspunkt: null,
    },
    fodselsdato: '1976-02-06',
    reservasjon: null,
};
