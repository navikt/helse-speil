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
    C = 'KeyC',
    F6 = 'F6',
}

const shouldDisableKeyboard = (): boolean =>
    document.activeElement instanceof HTMLTextAreaElement ||
    document.activeElement instanceof HTMLInputElement ||
    document.getElementById('modal') !== null;

export const useKeyboard = (actions: { [key: string]: Action }) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const action = actions[event.code];
        const hasActiveModifiers = event.getModifierState('Meta') || event.getModifierState('Alt');
        if (!action || shouldDisableKeyboard() || (action?.ignoreIfModifiers && hasActiveModifiers)) {
            return;
        }
        event.code === 'KeyC'
            ? event.altKey && !event.metaKey && actions[event.code]?.action() // Dette kunne vel ha vært løst litt mer elegant. For eksempel ved at man spesifiserer modifier keys sammen med aktuell key. Får ta det ved neste korsvei
            : actions[event.code]?.action();
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};
