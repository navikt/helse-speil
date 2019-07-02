import React from 'react';
import navLogoSrc from './img/navlogo.svg';
import ImageLink from '../ImageLink/ImageLink';
import useLoggedInUser from '../../hooks/useLoggedInUser';
import Search from '../Search/Search';
import './HeaderBar.css';

const HeaderBar = () => {
    const loggedInUser = useLoggedInUser('Ikke pålogget');

    return (
        <header className="topbar">
            <div className="title">
                <ImageLink
                    ariaLabel="Logo"
                    imgSrc={navLogoSrc.toString()}
                    href="/"
                />
                <h1>Sykepenger</h1>
            </div>

            <div className="header_divider" />

            <div className="center">
                <Search />
            </div>

            <div className="header_divider" />

            <div id="user" className="user">
                {loggedInUser.name}
            </div>
        </header>
    );
};

export default HeaderBar;
