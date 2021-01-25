import React from 'react';
import { Faresignaler } from './Faresignaler';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

describe('Faresignaler', () => {
    test('rendrer Faresignaler oppdaget og kontrollert', async () => {
        const enRisikovurdering = {
            funn: [
                {
                    kreverSupersaksbehandler: false,
                    beskrivelse: 'Går alltid med solbriller',
                    kategori: ['8-4'],
                },
                {
                    kreverSupersaksbehandler: false,
                    beskrivelse: 'Spiser aldri lunsj',
                    kategori: ['8-4'],
                },
            ],
            kontrollertOk: [
                {
                    kreverSupersaksbehandler: false,
                    beskrivelse: 'Er fra Vinderen',
                    kategori: [],
                },
            ],
        };
        render(<Faresignaler risikovurdering={enRisikovurdering} />);
        expect(screen.queryByText('Faresignaler oppdaget')).toBeVisible();
        expect(screen.queryByText('Faresignaler kontrollert')).toBeVisible();
        expect(screen.queryAllByText('Går alltid med solbriller')).toHaveLength(1);
        expect(screen.queryAllByText('Spiser aldri lunsj')).toHaveLength(1);
        expect(screen.queryAllByText('Er fra Vinderen')).toHaveLength(1);
    });

    test('rendrer ikke Faresignaler kontrollert eller oppdaget', async () => {
        const enRisikovurdering = {
            kontrollertOk: [],
            funn: [],
        };
        render(<Faresignaler risikovurdering={enRisikovurdering} />);
        expect(screen.queryByText('Faresignaler oppdaget')).toBeNull();
        expect(screen.queryByText('Faresignaler kontrollert')).toBeNull();
        expect(screen.queryAllByText('Går alltid med solbriller')).toHaveLength(0);
        expect(screen.queryAllByText('Spiser aldri lunsj')).toHaveLength(0);
        expect(screen.queryAllByText('Er fra Vinderen')).toHaveLength(0);
    });
});
