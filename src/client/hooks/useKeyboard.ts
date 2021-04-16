import { useEffect } from 'react';

export interface Action {
    action: () => void;
    ignoreIfModifiers?: boolean;
}

export enum Key {
    Left = 'ArrowLeft',
    Right = 'ArrowRight',
    Enter = 'Enter',
    Backspace = 'Backspace',
    Escape = 'Escape',
    C = 'KeyC',
}

const shouldDisableKeyboard = () =>
    document.activeElement instanceof HTMLTextAreaElement || document.activeElement instanceof HTMLInputElement;

export const useKeyboard = (actions: { [key: string]: Action }) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const action = actions[event.code];
        const hasActiveModifiers = event.getModifierState('Meta') || event.getModifierState('Alt');
        if (!action || shouldDisableKeyboard() || (action?.ignoreIfModifiers && hasActiveModifiers)) {
            return;
        }
        event.code === 'KeyC' ? event.altKey && actions[event.code]?.action() : actions[event.code]?.action();
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};
