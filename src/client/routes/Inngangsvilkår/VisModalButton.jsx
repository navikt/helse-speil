import React from 'react';
import PropTypes from 'prop-types';
import './VisModalButton.less';

const VisModalButton = ({ onClick }) => {
    return (
        <button className="VisModalButton" onClick={onClick} tabIndex={0}>
            Vis detaljer
        </button>
    );
};

VisModalButton.propTypes = {
    onClick: PropTypes.func
};

export default VisModalButton;
