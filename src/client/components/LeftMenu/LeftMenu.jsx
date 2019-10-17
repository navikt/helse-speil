import React from 'react';
import Nav from '../Nav';
import PropTypes from 'prop-types';
import './LeftMenu.less';

const LeftMenu = ({ behandling }) => {
    return (
        <div className="LeftMenu">
            <Nav active={behandling !== undefined} />
        </div>
    );
};

LeftMenu.propTypes = {
    behandling: PropTypes.any
};

export default LeftMenu;
