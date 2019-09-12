import React from 'react';
import Nav from '../Nav/Nav';
import CaseMenu from '../Nav/CaseMenu';
import PropTypes from 'prop-types';
import './LeftMenu.less';

const LeftMenu = ({ behandlinger, behandling, setValgtBehandling }) => {
    return (
        <div className="LeftMenu">
            {behandling && (
                <CaseMenu
                    behandlinger={behandlinger}
                    behandling={behandling}
                    setValgtBehandling={setValgtBehandling}
                />
            )}
            <Nav active={behandling !== undefined} />
        </div>
    );
};

LeftMenu.propTypes = {
    behandlinger: PropTypes.arrayOf(PropTypes.any).isRequired,
    behandling: PropTypes.any,
    setValgtBehandling: PropTypes.func.isRequired
};

export default LeftMenu;
