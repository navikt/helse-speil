import React from 'react';
import PropTypes from 'prop-types';
import './ListeSeparator.css';

const SeparatorType = {
    DOTTED: 'dotted',
    SOLID: 'solid'
};

const ListeSeparator = ({ type }) => (
    <div className="ListeSeparator">
        <hr className={type} />
    </div>
);

ListeSeparator.propTypes = {
    type: PropTypes.oneOf(Object.values(SeparatorType))
};

export default ListeSeparator;
