import { useEffect } from 'react';

export interface Action {
    action: () => void;
    ignoreIfModifiers?: boolean;
    modifier?: string;
}

export enum Key {
    Esc = 'Escape',
    Left = 'ArrowLeft',
    Right = 'ArrowRight',
    Enter = 'Enter',
    Backspace = 'Backspace',
    Alt = 'Alt',
    Shift = 'Shift',
    F1 = 'F1',
    F6 = 'F6',
    Minus = 'Minus',
    Slash = 'Slash',
    NumpadSubtract = 'NumpadSubtract',
    NumpadAdd = 'NumpadAdd',
    A = 'KeyA',
    B = 'KeyB',
    C = 'KeyC',
    G = 'KeyG',
    H = 'KeyH',
    I = 'KeyI',
    L = 'KeyL',
    M = 'KeyM',
    N = 'KeyN',
    O = 'KeyO',
    R = 'KeyR',
    S = 'KeyS',
}

const shouldDisableKeyboard = (): boolean =>
    document.activeElement instanceof HTMLTextAreaElement ||
    document.activeElement instanceof HTMLInputElement ||
    document.getElementById('modal') !== null;

export const useKeyboard = (actions: { [key: string]: Action }) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const action = actions[event.code];
        const hasActiveModifier = action?.modifier ? event.getModifierState(action?.modifier) : false;
        const hasActiveMeta = event.getModifierState('Meta');
        const hasActiveModifiers = hasActiveMeta || hasActiveModifier;
        if (
            !action ||
            shouldDisableKeyboard() ||
            (action?.ignoreIfModifiers && hasActiveModifiers) ||
            (action?.modifier && (!hasActiveModifier || hasActiveMeta))
        ) {
            return;
        }

        actions[event.code]?.action();
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};
