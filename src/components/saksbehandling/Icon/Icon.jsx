import React from 'react';
import PropTypes from 'prop-types';
import './Icon.less';

export const IconType = {
    AAREGISTERET: 'aaregisteret',
    INNTEKSTMELDING: 'inntekstmelding'
};

const Icon = ({ type }) => <svg className={`Icon Icon-${type}`} />;

Icon.propTypes = {
    type: PropTypes.oneOf(Object.values(IconType))
};

export default Icon;
