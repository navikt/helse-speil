import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ListSeparator.less';

const SeparatorType = {
    DOTTED: 'dotted',
    SOLID: 'solid',
    TRANSPARENT: 'transparent'
};

const ListSeparator = ({ type }) => <hr className={classNames('ListSeparator', type)} />;

ListSeparator.propTypes = {
    type: PropTypes.oneOf(Object.values(SeparatorType))
};

ListSeparator.defaultProps = {
    type: 'solid'
};

export default ListSeparator;
