import React from 'react';
import { Mock, vi } from 'vitest';

import { AndreYtelserSkjema } from '@saksbilde/tilkommenInntekt/skjema/AndreYtelserSkjema';
import { useFetchPersonQuery } from '@state/person';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

vi.mock('@state/person');

describe('AndreYtelserSkjema', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('viser periodemeldinger ved første submit', async () => {
        const user = userEvent.setup();
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: enPerson() } });

        render(<AndreYtelserSkjema />);

        await user.selectOptions(screen.getByRole('combobox', { name: 'Velg ytelse' }), 'Pleiepenger');
        await user.type(screen.getByLabelText('Notat til beslutter'), 'Et notat');
        await user.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Fra og med-dato er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Til og med-dato er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Velg grad')).toBeInTheDocument();
    });

    it('viser skjemafeil for grad over 99', async () => {
        const user = userEvent.setup();
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: enPerson() } });

        render(<AndreYtelserSkjema />);

        await user.selectOptions(screen.getByRole('combobox', { name: 'Velg ytelse' }), 'Pleiepenger');
        await user.type(screen.getByLabelText('Periode f.o.m.'), '01.01.2020');
        await user.type(screen.getByLabelText('Periode t.o.m.'), '03.01.2020');
        await user.type(screen.getByRole('spinbutton', { name: 'Grad' }), '100');
        await user.type(screen.getByLabelText('Notat til beslutter'), 'Et notat');
        await user.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Grad må være 99 eller lavere')).toBeInTheDocument();
    });

    it('tømmer siste periode når man trykker slett', async () => {
        const user = userEvent.setup();
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: enPerson() } });

        render(<AndreYtelserSkjema />);

        await user.type(screen.getByLabelText('Periode f.o.m.'), '01.01.2020');
        await user.type(screen.getByLabelText('Periode t.o.m.'), '03.01.2020');
        await user.type(screen.getByRole('spinbutton', { name: 'Grad' }), '50');
        await user.click(screen.getByRole('button', { name: 'Slett' }));

        expect(screen.getByLabelText('Periode f.o.m.')).toHaveValue('');
        expect(screen.getByLabelText('Periode t.o.m.')).toHaveValue('');
        expect(screen.getByRole('spinbutton', { name: 'Grad' })).toHaveValue(null);
    });
});
