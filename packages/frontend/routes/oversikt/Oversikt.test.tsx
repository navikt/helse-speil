import { RecoilWrapper } from '@test-wrappers';
import { axe } from 'jest-axe';
import React from 'react';

import { useMineOppgaver, useOppgaver, useOppgaverLoadable, useRefetchOppgaver } from '@state/oppgaver';
import { useResetPerson } from '@state/person';
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
        expect(useResetPerson).toHaveBeenCalled();
        expect(useRefetchOppgaver).toHaveBeenCalled();
    });
});

// Testen oversteg default setting på 5000 ved kjøring lokalt
jest.setTimeout(7000);
