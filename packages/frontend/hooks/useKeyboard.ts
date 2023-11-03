import { useEffect } from 'react';

export interface Action {
    key: string;
    action: () => void;
    ignoreIfModifiers?: boolean;
    modifier?: string;
    visningstekst?: string;
    visningssnarvei?: string[];
}

export enum Key {
    Esc = 'Escape',
    Left = 'ArrowLeft',
    Right = 'ArrowRight',
    Enter = 'Enter',
    Backspace = 'Backspace',
    Alt = 'Alt',
    Shift = 'Shift',
    Meta = 'Meta',
    F1 = 'F1',
    F6 = 'F6',
    Minus = 'Minus',
    Slash = 'Slash',
    NumpadSubtract = 'NumpadSubtract',
    NumpadAdd = 'NumpadAdd',
    A = 'KeyA',
    B = 'KeyB',
    C = 'KeyC',
    D = 'KeyD',
    E = 'KeyE',
    G = 'KeyG',
    H = 'KeyH',
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

export const useKeyboard = (actions: Action[]) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (!event.code) return; // Valg i autocomplete-lister, f.eks. i søkefeltet, trigger et tynt keydown-event, som vi ikke trenger å håndtere her
        const activeModifiers: string[] = [];
        if (event.getModifierState('Alt')) activeModifiers.push(Key.Alt);
        if (event.getModifierState('Shift')) activeModifiers.push(Key.Shift);
        if (event.getModifierState('Meta')) activeModifiers.push(Key.Meta);

        const action = Object.values(actions)
            .filter((action: Action) => action.key === event.code)
            .filter((action: Action) => action.modifier === undefined || activeModifiers.includes(action.modifier));

        if (
            !action ||
            shouldDisableKeyboard() ||
            (action[0]?.ignoreIfModifiers && activeModifiers.length) ||
            action.length !== 1 ||
            activeModifiers.includes(Key.Meta)
        ) {
            return;
        }

        action[0].action();
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};
