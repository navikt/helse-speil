import React, { ReactElement, useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Key, useKeyboard } from './useKeyboard';

const Consumer = (): ReactElement => {
    const [pressedKey, setPressedKey] = useState('');

    useKeyboard([
        { key: Key.Right, action: () => setPressedKey(Key.Right) },
        { key: Key.Left, action: () => setPressedKey(Key.Left) },
        { key: Key.Backspace, action: () => setPressedKey(Key.Backspace) },
        { key: Key.Enter, action: () => setPressedKey(Key.Enter) },
        { key: Key.C, action: () => setPressedKey(Key.C) },
    ]);

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
        fireEvent.keyDown(container, { code: Key.C, altKey: true });
        expect(container).toHaveTextContent(Key.C);
    });
    test('registrerer ikke tastetrykk når et inputelement har fokus', async () => {
        render(<Consumer />);
        const container = screen.getByTestId('container');
        const input = screen.getByTestId('input');
        expect(container).toHaveTextContent('');
        await userEvent.tab();
        expect(input).toHaveFocus();
        fireEvent.keyDown(container, { code: Key.Right });
        expect(container).not.toHaveTextContent(Key.Right);
        fireEvent.keyDown(container, { code: Key.C, altKey: true });
        expect(container).not.toHaveTextContent(Key.C);
    });
});
