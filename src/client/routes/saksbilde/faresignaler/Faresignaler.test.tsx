import React from 'react';
import { Faresignaler } from './Faresignaler';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

describe('Faresignaler', () => {
    test('rendrer arbeidsuførhetsvurdering', async () => {
        const enRisikovurdering = {
            ufullstendig: false,
            arbeidsuførhetvurdering: ['Går alltid med solbriller', 'Spiser aldri lunsj'],
        };
        render(<Faresignaler risikovurdering={enRisikovurdering} />);
        expect(screen.queryByText('Faresignaler oppdaget')).toBeVisible();
        expect(screen.queryByText('Faresignaler kontrollert')).toBeVisible();
        expect(screen.queryAllByText('Går alltid med solbriller')).toHaveLength(2);
        expect(screen.queryAllByText('Spiser aldri lunsj')).toHaveLength(2);
    });
});
