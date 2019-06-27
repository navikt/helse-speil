import React from 'react';
import Bolk from './Bolk';
import ListeItem from '../ListeItem';
import EnigBoks from '../EnigBoks';
import PropTypes from 'prop-types';
import './EnigBolk.css';

const EnigBolk = ({ label, value, hasInputField }) => (
    <span className="EnigBolk">
        <ListeItem label={label} value={value} />
        <EnigBoks hasInputField={hasInputField} />
    </span>
);

EnigBolk.propTypes = {
    ...Bolk.propTypes,
    hasInputField: PropTypes.bool
};

EnigBolk.defaultProps = {
    hasInputField: true
};

export default EnigBolk;
