import React from 'react';

import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { JsonVisning } from './JsonVisning';

const data = {
    navn: 'Ola',
    alder: 42,
    aktiv: true,
    adresse: null,
    barn: [{ navn: 'Kari' }],
};

describe('JsonVisning', () => {
    it('viser rotnivået åpent med verdier', () => {
        render(<JsonVisning data={data} />);

        expect(screen.getByText('"Ola"')).toBeVisible();
        expect(screen.getByText('42')).toBeVisible();
        expect(screen.getByText('true')).toBeVisible();
        expect(screen.getByText('null')).toBeVisible();
    });

    it('viser nøstede objekter lukket med antall', () => {
        render(<JsonVisning data={data} />);

        expect(screen.getByText('[ 1 element ]')).toBeVisible();
        expect(screen.getByText('"Kari"')).not.toBeVisible();
    });

    it('åpner et nøstet objekt ved klikk', async () => {
        render(<JsonVisning data={data} />);

        await userEvent.click(screen.getByText('barn:'));

        expect(screen.queryByText('[ 1 element ]')).not.toBeInTheDocument();
        expect(screen.getByText('{ 1 key }')).toBeVisible();
    });

    it('har kopieringsknapp per node', () => {
        render(<JsonVisning data={data} />);

        expect(screen.getByRole('button', { name: 'Kopier JSON' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Kopier alder' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Kopier barn' })).toBeInTheDocument();
    });

    it('åpner ikke noden ved klikk på kopieringsknappen', async () => {
        render(<JsonVisning data={data} />);

        await userEvent.click(screen.getByRole('button', { name: 'Kopier barn' }));

        expect(screen.getByText('[ 1 element ]')).toBeVisible();
    });
});
