import React from 'react';

import { FullmaktTag } from '@saksbilde/personHeader/FullmaktTag';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('@state/arbeidsgiver');

describe('FullmaktTag', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('rendrer tag når det finnes en periode til godkjenning med varsel for fullmakt', () => {
        (usePeriodeTilGodkjenning as jest.Mock).mockReturnValue({ varsler: [{ kode: 'SB_IK_1' }] });
        render(<FullmaktTag />);
        expect(screen.queryByText('Fullmakt')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes varsel for fullmakt på periode til godkjenning', () => {
        (usePeriodeTilGodkjenning as jest.Mock).mockReturnValue(null);
        render(<FullmaktTag />);
        expect(screen.queryByText('Fullmakt')).not.toBeInTheDocument();
    });
});
