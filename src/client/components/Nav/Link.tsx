import React, { ReactChild } from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
    children: ReactChild;
    id: string;
    to?: string;
    active?: boolean;
}

const Link = ({ active = true, id, to, children }: Props) => {
    const onClick = (event: React.MouseEvent) => {
        (event.target as HTMLElement).blur();
    };

    return active && to ? (
        <NavLink id={id} to={to} tabIndex={0} onClick={onClick}>
            {children}
        </NavLink>
    ) : (
        <a className="inactive">{children}</a>
    );
};

export default Link;
