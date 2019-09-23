import React from 'react';
import PropTypes from 'prop-types';
import './ListSeparator.less';

const SeparatorType = {
    DOTTED: 'dotted',
    SOLID: 'solid',
    TRANSPARENT: 'transparent'
};

const ListSeparator = ({ type }) => (
    <div className="ListeSeparator">
        <hr className={type} />
    </div>
);

ListSeparator.propTypes = {
    type: PropTypes.oneOf(Object.values(SeparatorType))
};

export default ListSeparator;
