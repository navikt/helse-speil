import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router';
import { authState } from '../state/authentication';

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
