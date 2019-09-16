import React, { useContext } from 'react';
import navLogoSrc from './img/navlogo.svg';
import { AuthContext } from '../../context/AuthContext';
import Search from '../Search/Search';
import './HeaderBar.less';

const HeaderBar = () => {
    const { authInfo: { name, isLoggedIn } = {} } = useContext(AuthContext);

    const username = isLoggedIn ? name : 'Ikke pålogget';

    return (
        <header className="topbar">
            <div className="title">
                <a className="header_link" href="/">
                    <img className="logo" aria-label="Logo" src={navLogoSrc.toString()} />
                    <h1>Sykepenger</h1>
                </a>
            </div>

            <div className="header_divider" />

            <div className="center">
                <Search />
            </div>

            <div className="header_divider" />

            <div id="user" className="user">
                {username}
            </div>
        </header>
    );
};

export default HeaderBar;
