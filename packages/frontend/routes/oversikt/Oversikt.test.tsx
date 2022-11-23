import { RecoilWrapper } from '@test-wrappers';
import { axe } from 'jest-axe';
import React from 'react';

import { useMineOppgaver, useOppgaver, useOppgaverLoadable } from '@state/oppgaver';
import { enOppgaveForOversikten } from '@test-data/oppgave';
import { render } from '@testing-library/react';

import Oversikt from './Oversikt';

jest.mock('@state/oppgaver');
jest.mock('@state/person');

describe('Oversikt', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('rendrer uten violations', async () => {
        const oppgaver = [enOppgaveForOversikten()];

        (useMineOppgaver as jest.Mock).mockReturnValue([]);
        (useOppgaver as jest.Mock).mockReturnValue(oppgaver);
        (useOppgaverLoadable as jest.Mock).mockReturnValue({
            state: 'hasValue',
            contents: oppgaver,
        });

        const { container } = render(<Oversikt />, { wrapper: RecoilWrapper });

        const result = await axe(container);

        expect(result).toHaveNoViolations();
    });
});
