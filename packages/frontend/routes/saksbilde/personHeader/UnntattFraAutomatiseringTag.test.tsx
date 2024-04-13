import React from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { UnntattFraAutomatiseringTag } from './UnntattFraAutomatiseringTag';

describe('UnntattFraAutomatiseringTag', () => {
    it('rendres ikke når personen ikke er unntatt fra automatisk godkjenning', () => {
        render(<UnntattFraAutomatiseringTag unntatt={false} />);
        expect(screen.queryByText('Unntatt fra automatisk godkjenning')).not.toBeInTheDocument();
        expect(screen.queryByText('Bruker er unntatt fra automatisk godkjenning')).not.toBeInTheDocument();
    });
    it('rendres når det personen er unntatt fra automatisk godkjenning', () => {
        render(<UnntattFraAutomatiseringTag unntatt={true} />);
        expect(screen.queryByText('Unntatt fra automatisk godkjenning')).toBeVisible();
    });
});
