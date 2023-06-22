import { RecoilAndRouterWrapper } from '@test-wrappers';
import React from 'react';

import { useFetchPerson } from '@state/person';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpeilError } from '@utils/error';

import { Header } from './Header';

jest.mock('@state/person');

let cachedVarsel: SpeilError | null = null;

jest.mock('@utils/featureToggles', () => ({
    erLocal: () => false,
    erDev: () => false,
}));

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
    useRemoveVarsel: () => () => {
        cachedVarsel = null;
    },
}));

describe('Header', () => {
    afterEach(() => {
        jest.clearAllMocks();
        cachedVarsel = null;
    });

    it('legger til varsel ved ugyldig søk', async () => {
        render(<Header />, { wrapper: RecoilAndRouterWrapper });
        await userEvent.type(screen.getByRole('searchbox'), 'test');
        fireEvent.submit(screen.getByRole('searchbox'));
        expect(cachedVarsel).not.toBeNull();
    });

    it('legger ikke til varsel ved gyldig søk', () => {
        (useFetchPerson as jest.Mock).mockReturnValueOnce(() => Promise.resolve(null));
        render(<Header />, { wrapper: RecoilAndRouterWrapper });
        userEvent.type(screen.getByRole('searchbox'), '12345678910');
        fireEvent.submit(screen.getByRole('searchbox'));
        expect(cachedVarsel).toBeNull();
    });
});
