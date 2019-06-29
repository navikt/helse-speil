import React from 'react';
import Bolk from './Bolk';
import ListeItem from '../ListeItem';
import Uenigboks from '../Uenigboks';
import './ListeItemBolk.css';

const ListeItemBolk = ({ label, value }) => (
    <span className="ListeItemBolk">
        <ListeItem label={label} value={value} />
<<<<<<< HEAD
        <Uenigboks label={label} />
=======
        <EnigBoks id={label} />
>>>>>>> da118e1... Add store for reports on frontend
    </span>
);

ListeItemBolk.propTypes = {
    ...Bolk.propTypes
};

export default ListeItemBolk;
