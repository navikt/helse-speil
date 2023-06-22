import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { FaresignalerWithContent } from './Faresignaler';

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
        render(<FaresignalerWithContent risikovurdering={enRisikovurdering} />);
        expect(screen.queryByText('Faresignaler oppdaget')).toBeVisible();
        expect(screen.queryByText('Faresignaler kontrollert')).toBeVisible();
        expect(screen.getByText('Går alltid med solbriller')).toBeInTheDocument();
        expect(screen.getByText('Spiser aldri lunsj')).toBeInTheDocument();
        expect(screen.getByText('Er fra Vinderen')).toBeInTheDocument();
    });

    test('rendrer ikke Faresignaler kontrollert eller oppdaget', async () => {
        const enRisikovurdering = {
            kontrollertOk: [],
            funn: [],
        };
        render(<FaresignalerWithContent risikovurdering={enRisikovurdering} />);
        expect(screen.queryByText('Faresignaler oppdaget')).not.toBeInTheDocument();
        expect(screen.queryByText('Faresignaler kontrollert')).not.toBeInTheDocument();
        expect(screen.queryByText('Går alltid med solbriller')).not.toBeInTheDocument();
        expect(screen.queryByText('Spiser aldri lunsj')).not.toBeInTheDocument();
        expect(screen.queryByText('Er fra Vinderen')).not.toBeInTheDocument();
    });
});
