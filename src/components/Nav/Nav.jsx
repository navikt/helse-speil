import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './Nav.less';
import { Normaltekst } from 'nav-frontend-typografi';

const Nav = ({ active }) => {
    const onClick = e => {
        if (!active) {
            e.preventDefault();
        } else {
            e.target.blur();
        }
    };

    return (
        <nav className={`Nav ${active ? '' : 'inactive'}`}>
            <NavLink exact id="nav-link-sykdomsvilkår" to="/" onClick={onClick}>
                <Normaltekst>Sykdomsvilkår</Normaltekst>
            </NavLink>
            <NavLink
                id="nav-link-inngangsvilkår"
                to="/inngangsvilkår"
                onClick={onClick}
            >
                <Normaltekst>Inngangsvilkår</Normaltekst>
            </NavLink>
            <NavLink id="nav-link-beregning" to="/beregning" onClick={onClick}>
                <Normaltekst>Sykepengegrunnlag</Normaltekst>
            </NavLink>
            <NavLink id="nav-link-periode" to="/periode" onClick={onClick}>
                <Normaltekst>Sykepengeperiode</Normaltekst>
            </NavLink>
            <NavLink
                id="nav-link-utbetaling"
                to="/utbetaling"
                onClick={onClick}
            >
                <Normaltekst>Utbetaling</Normaltekst>
            </NavLink>
            <NavLink
                id="nav-link-oppsummering"
                to="/oppsummering"
                onClick={onClick}
            >
                <Normaltekst>Oppsummering</Normaltekst>
            </NavLink>
        </nav>
    );
};

Nav.propTypes = {
    active: PropTypes.bool
};

export default Nav;
