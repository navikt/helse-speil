import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.less';
import { Normaltekst } from 'nav-frontend-typografi';

const Nav = () => {
    return (
        <nav className="Nav">
            <NavLink exact id="nav-link-sykdomsvilkår" to="/">
                <Normaltekst>Sykdomsvilkår</Normaltekst>
            </NavLink>
            <NavLink id="nav-link-inngangsvilkår" to="/inngangsvilkår">
                <Normaltekst>Inngangsvilkår</Normaltekst>
            </NavLink>
            <NavLink id="nav-link-beregning" to="/beregning">
                <Normaltekst>Sykepengegrunnlag</Normaltekst>
            </NavLink>
            <NavLink id="nav-link-periode" to="/periode">
                <Normaltekst>Sykepengeperiode</Normaltekst>
            </NavLink>
            <NavLink id="nav-link-utbetaling" to="/utbetaling">
                <Normaltekst>Utbetaling</Normaltekst>
            </NavLink>
            <NavLink id="nav-link-oppsummering" to="/oppsummering">
                <Normaltekst>Oppsummering</Normaltekst>
            </NavLink>
        </nav>
    );
};

export default Nav;
