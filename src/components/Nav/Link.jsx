import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Link = ({ active, id, to, children, exact }) => {
    const onClick = e => {
        if (!active) {
            e.preventDefault();
        } else {
            e.target.blur();
        }
    };

    return (
        <NavLink exact={exact} id={id} to={to} tabIndex={active ? 0 : -1} onClick={onClick}>
            {children}
        </NavLink>
    );
};

Link.propTypes = {
    children: PropTypes.node.isRequired,
    id: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    exact: PropTypes.bool,
    active: PropTypes.bool
};

Link.defaultProps = {
    exact: false,
    active: true
};

export default Link;
