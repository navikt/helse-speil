import { RecoilAndRouterWrapper } from '@test-wrappers';
import React from 'react';
import { MemoryRouter } from 'react-router';

import { useAuthentication } from '@state/authentication';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { ProtectedRoute } from './ProtectedRoute';

jest.mock('@state/authentication');

describe('ProtectedRoute', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('redirecter hvis bruker ikke er logget inn', () => {
        (useAuthentication as jest.Mock).mockReturnValue({
            name: '',
            ident: '',
            email: '',
            isLoggedIn: false,
        });

        render(
            <ProtectedRoute>
                <span>Denne skal ikke være synlig</span>
            </ProtectedRoute>,
            { wrapper: MemoryRouter },
        );
        expect(screen.queryByText('Denne skal ikke være synlig')).toBeNull();
    });

    it('redirecter ikke hvis bruker er logget inn', () => {
        (useAuthentication as jest.Mock).mockReturnValue({
            name: 'Navnesen, Navn',
            ident: 'N123456',
            email: 'navn.navnesen@nav.no',
            isLoggedIn: true,
        });

        render(
            <ProtectedRoute>
                <span>Denne skal være synlig</span>
            </ProtectedRoute>,
            { wrapper: RecoilAndRouterWrapper },
        );
        expect(screen.queryByText('Denne skal være synlig')).toBeVisible();
    });
});
