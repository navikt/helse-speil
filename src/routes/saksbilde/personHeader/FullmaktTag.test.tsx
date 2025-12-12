import React from 'react';
import { Mock, vi } from 'vitest';

import { FullmaktTag } from '@saksbilde/personHeader/FullmaktTag';
import { useFetchPersonQuery } from '@state/person';
import { enPerson } from '@test-data/person';
import { render, screen } from '@testing-library/react';

vi.mock('@state/person');

describe('FullmaktTag', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });
    it('rendrer tag når personinfo har fullmakt lik true', () => {
        const person = enPerson({ personinfo: { ...enPerson().personinfo, fullmakt: true } });
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: person } });
        render(<FullmaktTag person={person} />);
        expect(screen.queryByText('Fullmakt')).toBeVisible();
    });
    it('rendrer tag når personinfo har fullmakt lik false', () => {
        const person = enPerson({ personinfo: { ...enPerson().personinfo, fullmakt: false } });
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: person } });
        render(<FullmaktTag person={person} />);
        expect(screen.queryByText('Fullmakt')).not.toBeInTheDocument();
    });
    it('rendrer tag når personinfo har fullmakt lik null', () => {
        const person = enPerson({ personinfo: { ...enPerson().personinfo, fullmakt: null } });
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: person } });
        render(<FullmaktTag person={person} />);
        expect(screen.queryByText('Fullmakt')).not.toBeInTheDocument();
    });
});
