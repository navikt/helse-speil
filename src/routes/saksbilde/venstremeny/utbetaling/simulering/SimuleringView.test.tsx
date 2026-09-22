import React from 'react';

import { axe } from '@/test/axe';
import { enSimulering, enSimuleringsperiode, enSimuleringsutbetaling } from '@test-data/simulering';
import { render } from '@test-utils';
import { screen } from '@testing-library/react';

import { SimuleringView } from './SimuleringView';

describe('SimuleringView', () => {
    it('viser totalbeløp, mottaker og utbetaling-ID', () => {
        render(<SimuleringView simulering={enSimulering()} utbetalingId="en-utbetaling-id" />);

        expect(screen.getByText('Totalbeløp')).toBeVisible();
        expect(screen.getByText(pengetekst(15000))).toBeVisible();
        expect(screen.getByText('987654321 EN ARBEIDSGIVER AS')).toBeVisible();
        expect(screen.getByText('en-utbetaling-id')).toBeVisible();
    });

    it('utelater totalbeløp når det mangler', () => {
        render(<SimuleringView simulering={enSimulering({ totalbelop: null })} utbetalingId="en-utbetaling-id" />);

        expect(screen.queryByText('Totalbeløp')).not.toBeInTheDocument();
    });

    it('utelater «Utbetales til» når simuleringen ikke har utbetalinger', () => {
        const simulering = enSimulering({ perioder: [enSimuleringsperiode({ utbetalinger: [] })] });

        render(<SimuleringView simulering={simulering} utbetalingId="en-utbetaling-id" />);

        expect(screen.queryByText('Utbetales til')).not.toBeInTheDocument();
    });

    it('formaterer negative beløp som penger', () => {
        render(<SimuleringView simulering={enSimulering({ totalbelop: -1000 })} utbetalingId="en-utbetaling-id" />);

        expect(screen.getByText(pengetekst(-1000))).toBeVisible();
    });

    it('sladder mottaker, konto og refunderesOrgNr', () => {
        render(<SimuleringView simulering={enSimulering()} utbetalingId="en-utbetaling-id" />);

        expect(screen.getByText('987654321 EN ARBEIDSGIVER AS')).toHaveAttribute('data-sensitive');
        expect(screen.getByText('EN ARBEIDSGIVER AS')).toHaveAttribute('data-sensitive');
        expect(screen.getByText('1234567890')).toHaveAttribute('data-sensitive');
    });

    it('sladder ikke utbetaling-ID', () => {
        render(<SimuleringView simulering={enSimulering()} utbetalingId="en-utbetaling-id" />);

        expect(screen.getByText('en-utbetaling-id')).not.toHaveAttribute('data-sensitive');
    });

    it('viser én periode per simuleringsperiode', () => {
        const simulering = enSimulering({
            perioder: [
                enSimuleringsperiode({ fom: '2023-01-01', tom: '2023-01-31' }),
                enSimuleringsperiode({
                    fom: '2023-02-01',
                    tom: '2023-02-28',
                    utbetalinger: [enSimuleringsutbetaling({ mottakerId: '123456789' })],
                }),
            ],
        });

        render(<SimuleringView simulering={simulering} utbetalingId="en-utbetaling-id" />);

        expect(screen.getByText('01.01.2023 - 31.01.2023')).toBeVisible();
        expect(screen.getByText('01.02.2023 - 28.02.2023')).toBeVisible();
    });

    it('rendrer uten violations', async () => {
        const { container } = render(<SimuleringView simulering={enSimulering()} utbetalingId="en-utbetaling-id" />);

        const result = await axe(container);

        expect(result.violations).toHaveLength(0);
    });
});

// Testing Library normaliserer hardt mellomrom til vanlig mellomrom før sammenligning,
// så forventningen må gjøre det samme.
function pengetekst(beløp: number): string {
    return `${beløp.toLocaleString('nb-NO', { minimumFractionDigits: 2 })} kr`.replace(/\u00a0/g, ' ');
}
