import React from 'react';
import PropTypes from 'prop-types';
import './Icon.less';

export const IconType = {
    AAREGISTERET: 'aaregisteret',
    INNTEKSTMELDING: 'inntekstmelding',
    ARBEIDSGIVER_GRÅ: 'arbeidsgiver_grå',
    SYKMELDER: 'sykmelder',
    MENY: 'meny'
};

const Icon = ({ type }) => (
    <svg tabIndex="-1" className={`Icon Icon-${type}`} />
);

Icon.propTypes = {
    type: PropTypes.oneOf(Object.values(IconType))
};

export default Icon;
