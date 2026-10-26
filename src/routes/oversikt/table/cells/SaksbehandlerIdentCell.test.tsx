import { render, screen } from '@test-utils';

import { SaksbehandlerIdentCell } from './SaksbehandlerIdentCell';

describe('SaksbehandlerIdentCell', () => {
    test('markerer saksbehandleridenten for sladding', () => {
        render(
            <table>
                <tbody>
                    <tr>
                        <SaksbehandlerIdentCell name="Saksbehandler Navn" />
                    </tr>
                </tbody>
            </table>,
        );

        expect(screen.getByText('Saksbehandler Navn')).toHaveAttribute('data-sensitive');
    });
});
