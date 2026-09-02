import React from 'react';
import { Mock, vi } from 'vitest';

import { AndreYtelserSkjema } from '@saksbilde/andreYtelser/skjema/AndreYtelserSkjema';
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

        render(<AndreYtelserSkjema onSubmit={vi.fn()} onAvbryt={vi.fn()} />);

        await user.selectOptions(screen.getByRole('combobox', { name: 'Velg ytelse' }), 'Pleiepenger');
        await user.type(screen.getByLabelText('Notat til beslutter', { exact: false }), 'Et notat');
        await user.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Fra og med-dato er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Til og med-dato er påkrevd')).toBeInTheDocument();
        expect(screen.getByText('Velg grad')).toBeInTheDocument();
    });

    it('viser skjemafeil for grad over 99', async () => {
        const user = userEvent.setup();
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: enPerson() } });

        render(<AndreYtelserSkjema onSubmit={vi.fn()} onAvbryt={vi.fn()} />);

        await user.selectOptions(screen.getByRole('combobox', { name: 'Velg ytelse' }), 'Pleiepenger');
        await user.type(screen.getByLabelText('Periode f.o.m.'), '01.01.2020');
        await user.type(screen.getByLabelText('Periode t.o.m.'), '03.01.2020');
        await user.type(screen.getByRole('textbox', { name: 'Grad' }), '100');
        await user.type(screen.getByLabelText('Notat til beslutter', { exact: false }), 'Et notat');
        await user.click(screen.getByRole('button', { name: 'Lagre' }));

        expect(await screen.findByText('Grad må være 99 eller lavere')).toBeInTheDocument();
        // Graderingsfeilen ligger på hele periodelista og skal ikke skjule feltfeilen over.
        expect(
            screen.getByText(
                'Samlet gradering på tvers av alle ytelser kan ikke overstige 99 %. Grensen overskrides 01.01.2020–03.01.2020.',
            ),
        ).toBeInTheDocument();
    });

    it('la være å vise slett-knappen når det kun er én periode', async () => {
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: enPerson() } });

        render(<AndreYtelserSkjema onSubmit={vi.fn()} onAvbryt={vi.fn()} />);

        expect(screen.queryByRole('button', { name: 'Slett' })).not.toBeInTheDocument();
    });

    it('fjerner riktig periode når man trykker slett', async () => {
        const user = userEvent.setup();
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: enPerson() } });

        render(<AndreYtelserSkjema onSubmit={vi.fn()} onAvbryt={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: 'Legg til periode' }));
        await user.type(screen.getAllByLabelText('Periode f.o.m.')[0]!, '01.01.2020');
        await user.type(screen.getAllByLabelText('Periode t.o.m.')[0]!, '03.01.2020');
        await user.type(screen.getAllByLabelText('Periode f.o.m.')[1]!, '10.01.2020');
        await user.type(screen.getAllByLabelText('Periode t.o.m.')[1]!, '12.01.2020');

        await user.click(screen.getAllByRole('button', { name: 'Slett' })[0]!);

        expect(screen.getByLabelText('Periode f.o.m.')).toHaveValue('10.01.2020');
        expect(screen.getByLabelText('Periode t.o.m.')).toHaveValue('12.01.2020');
        expect(screen.queryByRole('button', { name: 'Slett' })).not.toBeInTheDocument();
    });
});
