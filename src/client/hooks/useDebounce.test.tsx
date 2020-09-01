import React from 'react';
import { useDebounce } from './useDebounce';
import { render, screen } from '@testing-library/react';

const Consumer = ({ timeout = 20 }) => {
    const show = useDebounce(true, timeout);
    return <>{show ? 'true' : 'false'}</>;
};

describe('useDebounce', () => {
    test('returnerer false før timeout', () => {
        render(<Consumer />);
        expect(screen.getByText('false')).toBeTruthy();
        expect(screen.getByText('true')).toBeFalsy();
    });
    test('returnerer true etter timeout', async () => {
        render(<Consumer timeout={0} />);
        await setTimeout(() => null, 0);
        expect(screen.getByText('true')).toBeTruthy();
        expect(screen.getByText('false')).toBeFalsy();
    });
});
