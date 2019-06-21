import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export const Keys = {
    LEFT: 37,
    RIGHT: 39
};

export const useKeyboard = (actionMappings) => {
    const handleKeyDown = e => {
        actionMappings.forEach(mapping => {
            if (mapping.keyCode === e.keyCode) {
                mapping.action();
            }
        });
    };

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
