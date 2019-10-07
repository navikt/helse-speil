import React from 'react';
import Nav from '../Nav';
import CaseMenu from '../CaseMenu/CaseMenu';
import PropTypes from 'prop-types';
import './LeftMenu.less';

const LeftMenu = ({ behandlinger, behandling, onSelectItem }) => {
    return (
        <div className="LeftMenu">
            {behandling && (
                <CaseMenu
                    behandlinger={behandlinger}
                    behandling={behandling}
                    onSelectItem={onSelectItem}
                />
            )}
            <Nav active={behandling !== undefined} />
        </div>
    );
};

LeftMenu.propTypes = {
    behandlinger: PropTypes.arrayOf(PropTypes.any).isRequired,
    behandling: PropTypes.any,
    onSelectItem: PropTypes.func.isRequired
};

export default LeftMenu;
