import React from 'react';
import PropTypes from 'prop-types';
import { Keys } from '../../../../hooks/useKeyboard';
import './Period.css';

const Period = ({ label, status, xPos, width, onClick }) => {
    const handleKeyPress = e => {
        if (e.keyCode === Keys.ENTER || e.keyCode === Keys.SPACE) {
            onClick();
        }
    };

    return (
        <div
            role="button"
            aria-label={label}
            className={`Period ${status}`}
            style={{
                left: xPos,
                width: `${width}px`
            }}
            tabIndex="0"
            onClick={onClick}
            onKeyDown={handleKeyPress}
        />
    );
};

Period.propTypes = {
    label: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    xPos: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    onClick: PropTypes.func
};

Period.defaultProps = {
    onClick: () => {}
};

export default Period;
