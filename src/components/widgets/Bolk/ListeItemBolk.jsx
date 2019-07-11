import React from 'react';
import Bolk from './Bolk';
import ListeItem from '../ListeItem';
import Uenigboks from '../Uenigboks';
import './ListeItemBolk.css';

const ListeItemBolk = ({ label, value }) => (
    <span className="ListeItemBolk">
        <ListeItem label={label} value={value} />
        <Uenigboks label={label} />
    </span>
);

ListeItemBolk.propTypes = {
    ...Bolk.propTypes
};

export default ListeItemBolk;
