import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { SpeilError } from '@utils/error';

import { Header } from './Header';
import { RecoilAndRouterWrapper } from '@test-wrappers';

let cachedVarsel: SpeilError | null = null;

jest.mock('graphql-request', () => ({
    request: () => Promise.resolve({}),
    gql: () => null,
}));

jest.mock('@state/varsler', () => ({
    __esModule: true,
    Scopes: { GLOBAL: '/' },
    useAddVarsel: () => (varsel: SpeilError) => {
        cachedVarsel = varsel;
    },
    useRemoveVarsel: () => (_: string) => {
        cachedVarsel = null;
    },
}));

afterEach(() => {
    cachedVarsel = null;
});

describe('Header', () => {
    test('legger til varsel ved ugyldig søk', () => {
        render(<Header />, { wrapper: RecoilAndRouterWrapper });
        userEvent.type(screen.getByRole('searchbox'), 'test');
        fireEvent.submit(screen.getByRole('searchbox'));
        expect(cachedVarsel).not.toBeNull();
    });
    test('legger ikke til varsel ved gyldig søk', () => {
        render(<Header />, { wrapper: RecoilAndRouterWrapper });
        userEvent.type(screen.getByRole('searchbox'), '12345678910');
        fireEvent.submit(screen.getByRole('searchbox'));
        expect(cachedVarsel).toBeNull();
    });
});
