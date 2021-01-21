import React from 'react';
import { render, screen } from '@testing-library/react';
import { TabLink } from './TabLink';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router';

describe('TabLink', () => {
    test('rendrer aktiv lenke hvis "to" er satt', () => {
        render(
            <MemoryRouter>
                <TabLink title="Test" to="/et/eller/annet/sted">
                    Test
                </TabLink>
            </MemoryRouter>
        );
        expect(screen.queryByText('Test')).toBeVisible();
        expect(screen.getByRole('tab')).toBeVisible();
    });
    test('rendrer disabled', () => {
        render(
            <TabLink title="Test" disabled>
                Test
            </TabLink>
        );
        expect(screen.queryByText('Test')).toBeVisible();
        expect(screen.queryByRole('tab')).toBeNull();
    });
});
