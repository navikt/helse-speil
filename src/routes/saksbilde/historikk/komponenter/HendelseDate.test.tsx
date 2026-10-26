import { render, screen } from '@test-utils';

import { HendelseDate } from './HendelseDate';

describe('HendelseDate', () => {
    it('sladder identen, men ikke tidspunktet', () => {
        render(<HendelseDate timestamp="2024-01-01T12:00:00Z" ident="12345678910" />);

        expect(screen.getByText('12345678910')).toHaveAttribute('data-sensitive');
        expect(screen.getByText(/2024/)).not.toHaveAttribute('data-sensitive');
    });
});
