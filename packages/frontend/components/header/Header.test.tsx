import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { VarselObject } from '../../state/varsler';

import { Header } from './Header';
import { RecoilAndRouterWrapper } from '@test-wrappers';

let cachedVarsel: VarselObject | null = null;

jest.mock('graphql-request', () => ({
    request: () => Promise.resolve({}),
    gql: () => null,
}));

jest.mock('@state/varsler', () => ({
    __esModule: true,
    Scopes: { GLOBAL: '/' },
    useAddVarsel: () => (varsel: VarselObject) => {
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
        userEvent.type(screen.getByRole('textbox'), 'test');
        userEvent.click(screen.getAllByRole('button')[0]);
        expect(cachedVarsel).not.toBeNull();
    });
    test('legger ikke til varsel ved gyldig søk', () => {
        render(<Header />, { wrapper: RecoilAndRouterWrapper });
        userEvent.type(screen.getByRole('textbox'), '12345678910');
        userEvent.click(screen.getAllByRole('button')[0]);
        expect(cachedVarsel).toBeNull();
    });
});
