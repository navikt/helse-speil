import React, { useRef, useState } from 'react';
import { useInteractOutside } from './useInteractOutside';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

afterEach(cleanup);

const Consumer = () => {
    const ref = useRef<HTMLButtonElement>(null);
    const [focused, setFocused] = useState(false);

    const toggleFocused = () => setFocused((f) => !f);

    useInteractOutside({
        ref,
        active: true,
        onInteractOutside: toggleFocused,
    });

    return (
        <>
            <button data-testid="button" ref={ref} onClick={toggleFocused}>
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
        act(() => userEvent.tab());
        expect(button2).toHaveFocus();
        expect(button1).toHaveTextContent('unfocused');
    });
});
