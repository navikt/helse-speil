import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { RecoilRoot } from 'recoil';

import { authState } from '../state/authentication';

import { ProtectedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
    test('redirecter hvis bruker ikke er logget inn', () => {
        render(
            <RecoilRoot
                initializeState={({ set }) => {
                    set(authState, { name: '', ident: '', email: '', isLoggedIn: false });
                }}
            >
                <MemoryRouter>
                    <ProtectedRoute>
                        <span>Denne skal ikke være synlig</span>
                    </ProtectedRoute>
                </MemoryRouter>
            </RecoilRoot>
        );
        expect(screen.queryByText('Denne skal ikke være synlig')).toBeNull();
    });
    test('redirecter ikke hvis bruker er logget inn', () => {
        render(
            <RecoilRoot>
                <MemoryRouter>
                    <ProtectedRoute>
                        <span>Denne skal være synlig</span>
                    </ProtectedRoute>
                </MemoryRouter>
            </RecoilRoot>
        );
        expect(screen.queryByText('Denne skal være synlig')).toBeVisible();
    });
});
