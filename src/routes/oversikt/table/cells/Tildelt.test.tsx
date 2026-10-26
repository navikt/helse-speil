import { render, screen } from '@test-utils';

import { Tildelt } from './Tildelt';

describe('Tildelt', () => {
    test('markerer saksbehandlernavnet for sladding', () => {
        render(<Tildelt name="Saksbehandler Navn" width={180} />);

        expect(screen.getByText('Saksbehandler Navn')).toHaveAttribute('data-sensitive');
    });
});
