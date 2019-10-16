import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const Keys = {
    LEFT: 37,
    RIGHT: 39,
    ENTER: 13,
    SPACE: 32,
    BACKSPACE: 8
};

const shouldDisableKeyboard = () =>
    document.activeElement.type?.toLowerCase() === 'textarea' ||
    document.activeElement.type?.toLowerCase() === 'text';

export const useKeyboard = actionMappings => {
    const [map, setMap] = useState({});

    const handleKeyDown = e => {
        if (!shouldDisableKeyboard()) {
            map[e.keyCode]?.();
        }
    };

    useEffect(() => {
        actionMappings.forEach(mapping => {
            setMap(map => ({
                ...map,
                [mapping.keyCode]: mapping.action
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
