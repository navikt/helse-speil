import React, { useContext } from 'react';
import Search from '../Search';
import { AuthContext } from '../../context/AuthContext';
import './HeaderBar.less';

const HeaderBar = () => {
    const { authInfo: { name, isLoggedIn } = {} } = useContext(AuthContext);

    const username = isLoggedIn ? name : 'Ikke pålogget';

    return (
        <header className="HeaderBar">
            <div className="title">
                <a href="/" aria-label="Logo">
                    <figure className="logo" />
                </a>
                <h1>Sykepenger</h1>
            </div>
            <div className="divider" />
            <div className="search">
                <Search />
            </div>
            <div className="divider" />
            <div id="user" className="user">
                {username}
            </div>
        </header>
    );
};

export default HeaderBar;
