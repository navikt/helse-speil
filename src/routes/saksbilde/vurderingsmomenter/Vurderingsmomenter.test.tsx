import React from 'react';

import { ApiRisikovurdering } from '@io/rest/generated/spesialist.schemas';
import { render, screen } from '@testing-library/react';

import { VurderingsmomenterWithContent } from './Vurderingsmomenter';

describe('Vurderingsmomenter', () => {
    test('rendrer Vurderingsmomenter oppdaget og kontrollert', async () => {
        const enRisikovurdering: ApiRisikovurdering = {
            funn: [
                {
                    beskrivelse: 'Går alltid med solbriller',
                    kategori: ['8-4'],
                },
                {
                    beskrivelse: 'Spiser aldri lunsj',
                    kategori: ['8-4'],
                },
            ],
            kontrollertOk: [
                {
                    beskrivelse: 'Er fra Vinderen',
                    kategori: [],
                },
            ],
        };
        render(<VurderingsmomenterWithContent risikovurdering={enRisikovurdering} />);
        expect(screen.queryByText('Vurderingsmomenter oppdaget')).toBeVisible();
        expect(screen.queryByText('Vurderingsmomenter kontrollert')).toBeVisible();
        expect(screen.getByText('Går alltid med solbriller')).toBeInTheDocument();
        expect(screen.getByText('Spiser aldri lunsj')).toBeInTheDocument();
        expect(screen.getByText('Er fra Vinderen')).toBeInTheDocument();
    });

    test('rendrer ikke Vurderingsmomenter kontrollert eller oppdaget', async () => {
        const enRisikovurdering: ApiRisikovurdering = {
            kontrollertOk: [],
            funn: [],
        };
        render(<VurderingsmomenterWithContent risikovurdering={enRisikovurdering} />);
        expect(screen.queryByText('Vurderingsmomenter oppdaget')).not.toBeInTheDocument();
        expect(screen.queryByText('Vurderingsmomenter kontrollert')).not.toBeInTheDocument();
        expect(screen.queryByText('Går alltid med solbriller')).not.toBeInTheDocument();
        expect(screen.queryByText('Spiser aldri lunsj')).not.toBeInTheDocument();
        expect(screen.queryByText('Er fra Vinderen')).not.toBeInTheDocument();
    });
});
