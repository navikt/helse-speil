import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { authState } from '../state/authentication';

import { ProtectedRoute } from './ProtectedRoute';
import { RecoilAndRouterWrapper } from '@test-wrappers';

describe('ProtectedRoute', () => {
    test('redirecter hvis bruker ikke er logget inn', () => {
        const notLoggedIn = { name: '', ident: '', email: '', isLoggedIn: false };

        const wrapper: React.FC<ChildrenProps> = ({ children }) => (
            <RecoilAndRouterWrapper
                initializeState={({ set }) => {
                    set(authState, notLoggedIn);
                }}
            >
                {children}
            </RecoilAndRouterWrapper>
        );

        render(
            <ProtectedRoute>
                <span>Denne skal ikke være synlig</span>
            </ProtectedRoute>,
            {
                wrapper,
            },
        );
        expect(screen.queryByText('Denne skal ikke være synlig')).toBeNull();
    });
    test('redirecter ikke hvis bruker er logget inn', () => {
        render(
            <ProtectedRoute>
                <span>Denne skal være synlig</span>
            </ProtectedRoute>,
            { wrapper: RecoilAndRouterWrapper },
        );
        expect(screen.queryByText('Denne skal være synlig')).toBeVisible();
    });
});
