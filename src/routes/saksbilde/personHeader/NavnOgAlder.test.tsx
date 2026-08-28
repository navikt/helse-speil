import dayjs from 'dayjs';

import { NavnOgAlder } from '@saksbilde/personHeader/NavnOgAlder';
import { render } from '@test-utils';
import { cleanup, screen } from '@testing-library/react';

describe('NavnOgAlder', () => {
    test('rendrer ok', () => {
        render(<NavnOgAlder {...defaultNavn} fødselsdato="1976-02-06" dødsdato={null} />);
        expect(screen.getByText('Bruce Batman Wayne (50 år)')).toBeVisible();
    });

    test('Regner alder ut fra fødselsdato', () => {
        const fødselsdato = '1978-06-14';
        render(<NavnOgAlder {...defaultNavn} fødselsdato={fødselsdato} dødsdato={null} />);
        const antallÅrMellomFødselsdatoOgNå = dayjs().diff(fødselsdato, 'year');
        expect(screen.getByText(`(${antallÅrMellomFødselsdatoOgNå} år)`, { exact: false })).toBeVisible();
    });

    test('viser riktig alder etter dødsfall', () => {
        const fødselsdato = '1980-02-01';
        render(<NavnOgAlder {...defaultNavn} fødselsdato={fødselsdato} dødsdato="2022-01-31" />);
        expect(screen.getByText('(41 år)', { exact: false })).toBeVisible();
        cleanup();
        render(<NavnOgAlder {...defaultNavn} fødselsdato={fødselsdato} dødsdato="2022-02-01" />);
        expect(screen.getByText('(42 år)', { exact: false })).toBeVisible();
    });
});

const defaultNavn = {
    fornavn: 'BRUCE',
    mellomnavn: 'BATMAN',
    etternavn: 'WAYNE',
};
