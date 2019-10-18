import React from 'react';
import PropTypes from 'prop-types';

const InfotrygdList = ({ children }) => {
    return <ul className="InfotrygdList">{children}</ul>;
};

InfotrygdList.propTypes = {
    children: PropTypes.node.isRequired
};

export default InfotrygdList;
