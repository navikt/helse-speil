import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { ReservasjonTag } from './ReservasjonTag';

describe('ReservasjonTag', () => {
    it('rendrer tag når det ikke finnes reservasjonsstatus', () => {
        render(<ReservasjonTag />);
        expect(screen.queryByText('Ikke registrert KRR')).toBeVisible();
    });
    it('rendrer tag når det finnes en reservasjon i KRR', () => {
        render(<ReservasjonTag reservasjon={{ reservert: true, kanVarsles: false }} />);
        expect(screen.queryByText('Reservert KRR')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes en reservasjon i KRR', () => {
        render(<ReservasjonTag reservasjon={{ reservert: false, kanVarsles: true }} />);
        expect(screen.queryByText('Reservert KRR')).not.toBeInTheDocument();
        expect(screen.queryByText('Ikke registrert KRR')).not.toBeInTheDocument();
    });
});
