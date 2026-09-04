import React from 'react';
import { Mock } from 'vitest';

import { fetchPersonMock } from '@apollo-mocks';
import { useNyheter } from '@external/sanity';
import { useKeyboardActions } from '@hooks/useKeyboardShortcuts';
import { render } from '@test-utils';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpeilError } from '@utils/error';

import { Header } from './Header';

vi.mock('@hooks/useKeyboardShortcuts');
vi.mock('@external/sanity');

let cachedVarsel: SpeilError | null = null;

vi.mock('@state/varsler', () => ({
    __esModule: true,
    Scopes: { GLOBAL: '/' },
    useAddVarsel: () => (varsel: SpeilError) => {
        cachedVarsel = varsel;
    },
    useRemoveVarsel: () => () => {
        cachedVarsel = null;
    },
    useRapporterGraphQLErrors: () => () => {},
}));

describe('Header', () => {
    beforeEach(() => {
        (useKeyboardActions as Mock).mockReturnValue(() => Promise.resolve(null));
        (useNyheter as Mock).mockReturnValue({ nyheter: [] });
    });
    afterEach(() => {
        vi.clearAllMocks();
        cachedVarsel = null;
    });

    it('legger til varsel ved ugyldig søk', async () => {
        render(<Header />, { mocks: [fetchPersonMock] });
        await userEvent.type(screen.getByRole('searchbox'), 'test');
        fireEvent.submit(screen.getByRole('searchbox'));
        expect(cachedVarsel).not.toBeNull();
    });

    it('legger ikke til varsel ved gyldig søk', async () => {
        render(<Header />, { mocks: [fetchPersonMock] });
        await userEvent.type(screen.getByRole('searchbox'), '12345678910');
        fireEvent.submit(screen.getByRole('searchbox'));
        expect(cachedVarsel).toBeNull();
    });
});
