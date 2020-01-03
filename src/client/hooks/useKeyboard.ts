import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export interface Action {
    key: string;
    action: () => void;
    ignoreIfModifiers?: boolean;
}

export interface Map {
    [key: string]: Action;
}

export const Keys = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    ENTER: 'Enter',
    SPACE: 'Space',
    BACKSPACE: 'Backspace',
    ESC: 'Escape'
};

const shouldDisableKeyboard = () =>
    document.activeElement instanceof HTMLTextAreaElement ||
    document.activeElement instanceof HTMLInputElement;

export const useKeyboard = (actions: Action[]) => {
    const [map, setMap] = useState<Map>({});

    const handleKeyDown = (event: KeyboardEvent) => {
        const action = map[event.code];
        if (!action || shouldDisableKeyboard() ||
            (action.ignoreIfModifiers && (event.getModifierState('Meta') || event.getModifierState('Alt')))) {
            return;
        }
        map[event.code]?.action();
    };

    useEffect(() => {
        actions.forEach(mapping => {
            setMap(map => ({
                ...map,
                [mapping.key]: {
                    ...mapping
                }
            }));
        });
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};

useKeyboard.propTypes = {
    actionMappings: PropTypes.arrayOf(
        PropTypes.shape({
            keyCode: PropTypes.number.isRequired,
            action: PropTypes.func.isRequired
        })
    )
};
