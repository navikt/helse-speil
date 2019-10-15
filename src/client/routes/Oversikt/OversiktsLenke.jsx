import React from 'react';
import PropTypes from 'prop-types';

const OversiktsLenke = ({ onClick, children }) => {
    const simulateOnClick = event => {
        if (event.keyCode === 13) {
            onClick();
        }
    };

    return (
        <a className="lenke" onClick={onClick} onKeyDown={simulateOnClick} tabIndex={0}>
            {children}
        </a>
    );
};

OversiktsLenke.propTypes = {
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    onClick: PropTypes.func.isRequired
};

export default OversiktsLenke;
