import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';
import { RecoilRoot } from 'recoil';
import { Varsel } from '../state/varslerState';

let cachedVarsel: Varsel | null = null;

jest.mock('../state/varslerState', () => ({
    __esModule: true,
    Scopes: { GLOBAL: '/' },
    useUpdateVarsler: () => ({
        fjernVarsler: () => {},
        leggTilVarsel: (varsel: Varsel) => {
            cachedVarsel = varsel;
        },
    }),
}));

afterEach(() => {
    cachedVarsel = null;
});

describe('Header', () => {
    test('legger til varsel ved ugyldig søk', async () => {
        render(
            <RecoilRoot>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </RecoilRoot>
        );
        userEvent.type(screen.getByRole('textbox'), 'test');
        userEvent.click(screen.getByRole('button'));
        expect(cachedVarsel).not.toBeNull();
    });
    test('legger ikke til varsel ved gyldig søk', async () => {
        render(
            <RecoilRoot>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </RecoilRoot>
        );
        userEvent.type(screen.getByRole('textbox'), '12345678910');
        userEvent.click(screen.getByRole('button'));
        expect(cachedVarsel).toBeNull();
    });
});
