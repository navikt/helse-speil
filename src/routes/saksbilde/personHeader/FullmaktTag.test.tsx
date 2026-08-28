import React from 'react';

import { FullmaktTag } from '@saksbilde/personHeader/FullmaktTag';
import { render, screen } from '@testing-library/react';

describe('FullmaktTag', () => {
    it('rendrer tag når personen har fullmakt lik true', () => {
        render(<FullmaktTag fullmakt={true} />);
        expect(screen.queryByText('Fullmakt')).toBeVisible();
    });
    it('rendrer ikke tag når personen har fullmakt lik false', () => {
        render(<FullmaktTag fullmakt={false} />);
        expect(screen.queryByText('Fullmakt')).not.toBeInTheDocument();
    });
    it('rendrer ikke tag når personen har fullmakt lik null', () => {
        render(<FullmaktTag fullmakt={null} />);
        expect(screen.queryByText('Fullmakt')).not.toBeInTheDocument();
    });
});
