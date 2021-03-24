import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Oppgaveetikett } from './Oppgaveetikett';
import { Periodetype } from 'internal-types';

describe('Oppgaveetikett', () => {
    test('viser riktig etikett for forlengelser', () => {
        render(<Oppgaveetikett type={Periodetype.Forlengelse} />);
        expect(screen.getByText('Forlengelse')).toBeVisible();
    });
    test('viser riktig etikett for Infotrygdforlengelser', () => {
        render(<Oppgaveetikett type={Periodetype.Infotrygdforlengelse} />);
        expect(screen.getByText('Forlengelse')).toBeVisible();
    });
    test('viser riktig etikett for førstegangsbehandlinger', () => {
        render(<Oppgaveetikett type={Periodetype.Førstegangsbehandling} />);
        expect(screen.getByText('Førstegang.')).toBeVisible();
    });
    test('viser riktig etikett for overganger fra Infotrygd', () => {
        render(<Oppgaveetikett type={Periodetype.OvergangFraInfotrygd} />);
        expect(screen.getByText('Forlengelse - IT')).toBeVisible();
    });
    test('viser riktig etikett for stikkprøver', () => {
        render(<Oppgaveetikett type={Periodetype.Stikkprøve} />);
        expect(screen.getByText('Stikkprøve')).toBeVisible();
    });
});
