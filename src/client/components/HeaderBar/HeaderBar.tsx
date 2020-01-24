import React, { useContext } from 'react';
import Search from '../Search';
import { AuthContext } from '../../context/AuthContext';
import './HeaderBar.less';

const HeaderBar = () => {
    const { authInfo } = useContext(AuthContext);
    const { name, isLoggedIn } = authInfo;

    const username = isLoggedIn ? name : 'Ikke pålogget';

    return (
        <header className="HeaderBar">
            <a href={'/'} className="title">
                <h1>NAV Sykepenger</h1>
            </a>
            <div className="divider" />
            <div className="search">
                <div>
                    <Search />
                </div>
            </div>
            <div className="divider" />
            <div id="user" className="user">
                {username}
            </div>
        </header>
    );
};

export default HeaderBar;
