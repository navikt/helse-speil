import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useRef, useState } from 'react';
import { act } from 'react-dom/test-utils';

import { useInteractOutside } from './useInteractOutside';

afterEach(cleanup);

const Consumer = () => {
    const ref = useRef<HTMLButtonElement>(null);
    const [focused, setFocused] = useState(false);

    useInteractOutside({
        ref,
        active: true,
        onInteractOutside: () => setFocused(false),
    });

    return (
        <>
            <button data-testid="button" ref={ref} onClick={() => setFocused(true)}>
                {focused ? 'focused' : 'unfocused'}
            </button>
            <button data-testid="button">En annen knapp</button>
        </>
    );
};

describe('useInteractOutside', () => {
    test('kaller `onInteractOutside` ved klikk utenfor elementet sitt', async () => {
        render(<Consumer />);

        const [button1, button2] = screen.getAllByTestId('button');
        expect(button1).toHaveTextContent('unfocused');
        act(() => userEvent.click(button1));
        expect(button1).toHaveFocus();
        expect(button1).toHaveTextContent('focused');
        act(() => userEvent.click(button2));
        expect(button2).toHaveFocus();
        await waitFor(() => expect(button1).toHaveTextContent('unfocused'));
    });
});
