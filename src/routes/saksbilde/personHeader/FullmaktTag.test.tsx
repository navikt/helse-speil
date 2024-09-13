import React from 'react';

import { FullmaktTag } from '@saksbilde/personHeader/FullmaktTag';
import { useFetchPersonQuery } from '@state/person';
import { enPerson } from '@test-data/person';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('@state/person');

describe('FullmaktTag', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('rendrer tag når personinfo har fullmakt lik true', () => {
        const person = enPerson({ personinfo: { ...enPerson().personinfo, fullmakt: true } });
        (useFetchPersonQuery as jest.Mock).mockReturnValue({ data: { person: person } });
        render(<FullmaktTag person={person} />);
        expect(screen.queryByText('Fullmakt')).toBeVisible();
    });
    it('rendrer tag når personinfo har fullmakt lik false', () => {
        const person = enPerson({ personinfo: { ...enPerson().personinfo, fullmakt: false } });
        (useFetchPersonQuery as jest.Mock).mockReturnValue({ data: { person: person } });
        render(<FullmaktTag person={person} />);
        expect(screen.queryByText('Fullmakt')).not.toBeInTheDocument();
    });
    it('rendrer tag når personinfo har fullmakt lik null', () => {
        const person = enPerson({ personinfo: { ...enPerson().personinfo, fullmakt: null } });
        (useFetchPersonQuery as jest.Mock).mockReturnValue({ data: { person: person } });
        render(<FullmaktTag person={person} />);
        expect(screen.queryByText('Fullmakt')).not.toBeInTheDocument();
    });
});
