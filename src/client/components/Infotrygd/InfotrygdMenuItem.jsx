import React from 'react';
import PropTypes from 'prop-types';

const InfotrygdMenuItem = ({ abbreviation, label, disabled }) => {
    const style = disabled && { color: 'grey' };
    return (
        <li style={style}>
            <span>{abbreviation}</span>
            <span style={style}>{label}</span>
        </li>
    );
};

InfotrygdMenuItem.propTypes = {
    abbreviation: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

export default InfotrygdMenuItem;
