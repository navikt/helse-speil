import React from 'react';

import { finnPeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { enPerson } from '@test-data/person';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { VergemålTag } from './VergemålTag';

jest.mock('@state/arbeidsgiver');

describe('VergemålTag', () => {
    const person = enPerson();
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('rendrer tag når det finnes en periode til godkjenning med varsel for vergemål', () => {
        (finnPeriodeTilGodkjenning as jest.Mock).mockReturnValue({ varsler: [{ kode: 'SB_EX_4' }] });
        render(<VergemålTag person={person} />);
        expect(screen.queryByText('Vergemål')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes varsel for vergemål på periode til godkjenning', () => {
        (finnPeriodeTilGodkjenning as jest.Mock).mockReturnValue(null);
        render(<VergemålTag person={person} />);
        expect(screen.queryByText('Vergemål')).not.toBeInTheDocument();
    });
});
