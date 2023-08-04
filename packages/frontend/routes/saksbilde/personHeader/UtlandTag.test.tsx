import React from 'react';

import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import { UtlandTag } from './UtlandTag';

jest.mock('@state/arbeidsgiver');

describe('UtlandTag', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('rendrer tag når det finnes en periode til godkjenning med varsel for utlandsenhet', () => {
        (usePeriodeTilGodkjenning as jest.Mock).mockReturnValue({
            varsler: [
                {
                    kode: 'SB_EX_5',
                    tittel: 'Det har kommet inn dokumentasjon som igangsetter en revurdering, og den sykmeldte er nå registrert på bokommune 0393 (NAV utland og fellestjenester)',
                },
            ],
        });
        render(<UtlandTag />);
        expect(screen.queryByText('Utland')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes varsel for utlandsenhet på periode til godkjenning', () => {
        (usePeriodeTilGodkjenning as jest.Mock).mockReturnValue(null);
        render(<UtlandTag />);
        expect(screen.queryByText('Utland')).not.toBeInTheDocument();
    });
});
