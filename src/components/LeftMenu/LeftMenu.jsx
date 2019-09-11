import React from 'react';
import Nav from '../Nav/Nav';
import CaseMenu from '../Nav/CaseMenu';
import PropTypes from 'prop-types';
import './LeftMenu.less';

const LeftMenu = ({ behandling }) => {
    return (
        <div className="LeftMenu">
            {behandling && <CaseMenu behandling={behandling} />}
            <Nav active={behandling !== undefined} />
        </div>
    );
};

LeftMenu.propTypes = {
    behandling: PropTypes.any
};

export default LeftMenu;
