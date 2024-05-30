import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { ReservasjonTag } from './ReservasjonTag';

describe('ReservasjonTag', () => {
    it('rendrer tag når det ikke finnes reservasjonsstatus', () => {
        render(<ReservasjonTag reservasjon={null} />);
        expect(screen.queryByText('Status KRR utilgjengelig')).toBeVisible();
    });
    it('rendrer tag når det finnes en reservasjon i KRR', () => {
        render(<ReservasjonTag reservasjon={{ reservert: true, kanVarsles: false }} />);
        expect(screen.queryByText('Reservert KRR')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes en reservasjon i KRR', () => {
        render(<ReservasjonTag reservasjon={{ reservert: false, kanVarsles: true }} />);
        expect(screen.queryByText('Reservert KRR')).not.toBeInTheDocument();
        expect(screen.queryByText('Ikke registrert KRR')).not.toBeInTheDocument();
        expect(screen.queryByText('Status KRR utilgjengelig')).not.toBeInTheDocument();
    });
});
