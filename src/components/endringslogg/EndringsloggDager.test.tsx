import { Sykedag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import { render, screen } from '@test-utils';
import { OverstyringerPrDag } from '@typer/utbetalingstabell';

import { EndringsloggDager } from './EndringsloggDager';

describe('EndringsloggDager', () => {
    it('marker saksbehandlerident for sladding', () => {
        const endring: OverstyringerPrDag = {
            vedtaksperiodeId: 'vedtaksperiodeId',
            hendelseId: 'hendelseId',
            begrunnelse: 'En begrunnelse',
            saksbehandler: {
                ident: 'A123456',
                navn: 'En saksbehandler',
            },
            timestamp: '2020-01-01',
            dag: Sykedag,
            dato: '2020-01-01',
            ferdigstilt: false,
        };

        render(<EndringsloggDager endringer={[endring]} onOpenChange={vi.fn()} />);

        expect(screen.getByText('A123456')).toHaveAttribute('data-sensitive');
    });
});
