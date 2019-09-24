import React, { useContext } from 'react';
import Search from '../Search';
import { AuthContext } from '../../context/AuthContext';
import './HeaderBar.less';
import { Link } from 'react-router-dom';

const HeaderBar = () => {
    const { authInfo: { name, isLoggedIn } = {} } = useContext(AuthContext);

    const username = isLoggedIn ? name : 'Ikke pålogget';

    return (
        <header className="HeaderBar">
            <Link to={'/'} className="title">
                <h1>NAV Sykepenger</h1>
            </Link>
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
