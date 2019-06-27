import React from 'react';
import Bolk from './Bolk';
import ListeItem from '../ListeItem';
import EnigBoks from '../EnigBoks';
import './EnigBolk.css';

const EnigBolk = ({ label, value }) => (
    <span className="EnigBolk">
        <ListeItem label={label} value={value} />
        <EnigBoks hasInputField={false} />
    </span>
);

EnigBolk.propTypes = {
    ...Bolk.propTypes
};

export default EnigBolk;
