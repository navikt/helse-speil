import React from 'react';
import PropTypes from 'prop-types';
import './Bolk.css';
import EnigBoks from './EnigBoks';
import IkonHeader from './IkonHeader';

const Bolk = props => {
    return (
        <div className="bolk">
            <div className="vilkårskolonne">
                <IkonHeader title={props.title} items={props.items} />
            </div>
            <EnigBoks />
        </div>
    );
};

Bolk.propTypes = {
    ...IkonHeader.propTypes
};

export default Bolk;
