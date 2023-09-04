import { VergemålTag } from './VergemålTag';
import React from 'react';

import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('@state/arbeidsgiver');

describe('VergemålTag', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('rendrer tag når det finnes en periode til godkjenning med varsel for vergemål', () => {
        (usePeriodeTilGodkjenning as jest.Mock).mockReturnValue({ varsler: [{ kode: 'SB_EX_4' }] });
        render(<VergemålTag />);
        expect(screen.queryByText('Vergemål')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes varsel for vergemål på periode til godkjenning', () => {
        (usePeriodeTilGodkjenning as jest.Mock).mockReturnValue(null);
        render(<VergemålTag />);
        expect(screen.queryByText('Vergemål')).not.toBeInTheDocument();
    });
});
