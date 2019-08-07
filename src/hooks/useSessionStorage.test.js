import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import { useSessionStorage } from './useSessionStorage';

const Container = () => {
    const [state, setState] = useSessionStorage('test', 0);

    return (
        <>
            <div data-testid="stateValue">{state}</div>
            <button
                data-testid="increment"
                onClick={() => setState(state + 1)}
            />
            <button
                data-testid="decrement"
                onClick={() => setState(state - 1)}
            />
        </>
    );
};

const mockStorage = {};

beforeAll(() => {
    global.sessionStorage = {};
    global.sessionStorage.setItem = (key, value) => (mockStorage[key] = value);
    global.sessionStorage.getItem = key => mockStorage[key];
});

afterAll(() => {
    global.sessionStorage = null;
});

describe('useSessionStorage', () => {
    it('updates state', () => {
        const container = render(<Container />).container;
        const stateValue = getByTestId(container, 'stateValue');
        const incrementButton = getByTestId(container, 'increment');
        const decrementButton = getByTestId(container, 'decrement');

        expect(stateValue.textContent).toBe('0');
        fireEvent.click(incrementButton);
        expect(stateValue.textContent).toBe('1');
        fireEvent.click(decrementButton);
        fireEvent.click(decrementButton);
        expect(stateValue.textContent).toBe('-1');
    });

    it('persists state', () => {
        const container = render(<Container />).container;
        const stateValue = getByTestId(container, 'stateValue');
        expect(stateValue.textContent).toBe('-1');
    });
});
