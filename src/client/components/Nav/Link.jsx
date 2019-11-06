import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Link = ({ active, id, to, children }) => {
    return active ? (
        <NavLink id={id} to={to} tabIndex={0} onClick={e => e.target.blur()}>
            {children}
        </NavLink>
    ) : (
        <a className="inactive">{children}</a>
    );
};

Link.propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    active: PropTypes.bool
};

Link.defaultProps = {
    active: true
};

export default Link;
