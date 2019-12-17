import React from 'react';
import PropTypes from 'prop-types';
import './VisModalButton.less';

const VisModalButton = ({ onClick, tekst }) => {
    return (
        <button className="VisModalButton" onClick={onClick} tabIndex={0}>
            {tekst}
        </button>
    );
};

VisModalButton.defaultProps = {
    tekst: 'Vis detaljer'
};
VisModalButton.propTypes = {
    onClick: PropTypes.func,
    tekst: PropTypes.string
};

export default VisModalButton;
