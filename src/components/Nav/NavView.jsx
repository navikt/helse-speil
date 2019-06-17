import React from 'react'
import { NavLink } from 'react-router-dom'
import './NavView.css'

const Nav = () => {
    return (
        <nav>
            <li>
                <NavLink
                    exact
                    id='nav-link-sykdomsvilkår'
                    to="/"
                />
            </li>
            <li>
                <NavLink
                    id='nav-link-inngangsvilkår'
                    to="/inngangsvilkår"
                />
            </li>
            <li>
                <NavLink
                    id='nav-link-beregning'
                    to="/beregning"
                />
            </li>
            <li>
                <NavLink
                    id='nav-link-periode'
                    to="/periode"
                />
            </li>
            <li>
                <NavLink
                    id='nav-link-utbetaling'
                    to="/utbetaling"
                />
            </li>
            <li>
                <NavLink
                    id='nav-link-oppsummering'
                    to="/opppsummering"
                />
            </li>
        </nav>
    )
}

export default Nav
