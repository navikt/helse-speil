import React from 'react';
import { useDebounce } from './useDebounce';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';

const Consumer = ({ timeout = 20 }) => {
    const show = useDebounce(true, timeout);
    return <div data-testid="container">{show ? 'true' : 'false'}</div>;
};

describe('useDebounce', () => {
    test('returnerer false før timeout', () => {
        act(() => {
            render(<Consumer />);
            const container = screen.getByTestId('container');
            waitFor(() => expect(container).toHaveTextContent('false'));
        });
    });
    test('returnerer true etter timeout', async () => {
        await act(async () => {
            render(<Consumer timeout={0} />);
            await waitFor(() => expect(screen.getByTestId('container')).toHaveTextContent('true'));
        });
    });
});
