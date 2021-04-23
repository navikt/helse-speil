import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Oppgaveetikett } from './Oppgaveetikett';
import { Periodetype } from 'internal-types';

describe('Oppgaveetikett', () => {
    test('viser riktig etikett for forlengelser med label', () => {
        render(<Oppgaveetikett type={Periodetype.Forlengelse} medLabel={true} />);
        expect(screen.getByText('Forlengelse')).toBeVisible();
    });
    test('viser riktig etikett for Infotrygdforlengelser med label', () => {
        render(<Oppgaveetikett type={Periodetype.Infotrygdforlengelse} medLabel={true} />);
        expect(screen.getByText('Forlengelse')).toBeVisible();
    });
    test('viser riktig etikett for førstegangsbehandlinger med label', () => {
        render(<Oppgaveetikett type={Periodetype.Førstegangsbehandling} medLabel={true} />);
        expect(screen.getByText('Førstegang.')).toBeVisible();
    });
    test('viser riktig etikett for overganger fra Infotrygd med label', () => {
        render(<Oppgaveetikett type={Periodetype.OvergangFraInfotrygd} medLabel={true} />);
        expect(screen.getByText('Forlengelse IT')).toBeVisible();
    });
    test('viser riktig etikett for stikkprøver med label', () => {
        render(<Oppgaveetikett type={Periodetype.Stikkprøve} medLabel={true} />);
        expect(screen.getByText('Stikkprøve')).toBeVisible();
    });
    test('viser riktig etikett for QA med label', () => {
        render(<Oppgaveetikett type={Periodetype.RiskQa} medLabel={true} />);
        expect(screen.getByText('Risk QA')).toBeVisible();
    });
});
