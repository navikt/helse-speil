import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const Keys = {
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13,
    SPACE: 32,
    BACKSPACE: 8,
    ESC: 27
};

const shouldDisableKeyboard = () =>
    document.activeElement.type?.toLowerCase() === 'textarea' ||
    document.activeElement.type?.toLowerCase() === 'text';

export const useKeyboard = actionMappings => {
    const [map, setMap] = useState({});

    const handleKeyDown = e => {
        const keyConfig = map[e.keyCode];
        if (!keyConfig || shouldDisableKeyboard()) return;

        if (
            keyConfig.ignoreIfModifiers &&
            (e.getModifierState('Meta') || e.getModifierState('Alt'))
        ) {
            return;
        }
        map[e.keyCode]?.action();
    };

    useEffect(() => {
        actionMappings.forEach(mapping => {
            setMap(map => ({
                ...map,
                [mapping.keyCode]: {
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
