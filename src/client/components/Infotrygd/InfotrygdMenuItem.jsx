import React from 'react';
import PropTypes from 'prop-types';

const InfotrygdMenuItem = ({ abbreviation, label }) => {
    return (
        <li>
            <span>{abbreviation}</span>
            <span>{label}</span>
        </li>
    );
};

InfotrygdMenuItem.propTypes = {
    abbreviation: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
};

export default InfotrygdMenuItem;
