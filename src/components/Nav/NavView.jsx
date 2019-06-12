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
        </nav>
    )
}

export default Nav
