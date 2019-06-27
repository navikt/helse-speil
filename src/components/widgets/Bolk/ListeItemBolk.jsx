import React from 'react';
import Bolk from './Bolk';
import ListeItem from '../ListeItem';
import EnigBoks from '../EnigBoks';
import './ListeItemBolk.css';

const ListeItemBolk = ({ label, value }) => (
    <span className="ListeItemBolk">
        <ListeItem label={label} value={value} />
        <EnigBoks />
    </span>
);

ListeItemBolk.propTypes = {
    ...Bolk.propTypes
};

export default ListeItemBolk;
