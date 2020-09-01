import React, { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Key, useKeyboard } from './useKeyboard';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

afterEach(cleanup);

const Consumer = () => {
    const [pressedKey, setPressedKey] = useState('');

    useKeyboard({
        [Key.Right]: { action: () => setPressedKey(Key.Right) },
        [Key.Left]: { action: () => setPressedKey(Key.Left) },
        [Key.Backspace]: { action: () => setPressedKey(Key.Backspace) },
        [Key.Enter]: { action: () => setPressedKey(Key.Enter) },
    });

    return (
        <>
            <div data-testid="container">{pressedKey}</div>
            <input data-testid="input" />
        </>
    );
};

describe('useKeyboard', () => {
    test('registrerer tastetrykk', () => {
        render(<Consumer />);
        const container = screen.getByTestId('container');
        expect(container).toHaveTextContent('');
        fireEvent.keyDown(container, { code: Key.Right });
        expect(container).toHaveTextContent(Key.Right);
        fireEvent.keyDown(container, { code: Key.Left });
        expect(container).toHaveTextContent(Key.Left);
        fireEvent.keyDown(container, { code: Key.Escape });
        expect(container).not.toHaveTextContent(Key.Escape);
    });
    test('registrerer ikke tastetrykk når et inputelement har fokus', () => {
        render(<Consumer />);
        const container = screen.getByTestId('container');
        const input = screen.getByTestId('input');
        expect(container).toHaveTextContent('');
        userEvent.tab();
        expect(input).toHaveFocus();
        fireEvent.keyDown(container, { code: Key.Right });
        expect(container).not.toHaveTextContent(Key.Right);
    });
});
