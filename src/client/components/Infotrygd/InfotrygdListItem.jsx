import React from 'react';
import PropTypes from 'prop-types';

const InfotrygdListItem = ({ label, status, children }) => {
    return (
        <>
            <span className="InfotrygdListItem__status">{status ?? ''}</span>
            <span className="InfotrygdListItem__label">{label}</span>
            <span className="InfotrygdListItem__children">{children}</span>
        </>
    );
};

InfotrygdListItem.propTypes = {
    label: PropTypes.string,
    status: PropTypes.string,
    children: PropTypes.node
};

export default InfotrygdListItem;
