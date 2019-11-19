import React from 'react';
import PropTypes from 'prop-types';
import './List.less';

const List = ({ children }) => {
    return <div className="List">{children}</div>;
};

List.propTypes = {
    children: PropTypes.arrayOf(PropTypes.node)
};

export default List;
