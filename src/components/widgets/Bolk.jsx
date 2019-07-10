import React from 'react';
import PropTypes from 'prop-types';
import EnigBoks from './EnigBoks';
import IkonHeader from './IkonHeader';
import './Bolk.css';

const Bolk = ({ title, titleValue, items, ikon = true }) => {
    return (
        <div className="bolk">
            <div className="vilkårskolonne">
                <IkonHeader
                    title={title}
                    titleValue={titleValue}
                    items={items}
                    ikon={ikon}
                />
            </div>
            <EnigBoks />
        </div>
    );
};

Bolk.propTypes = {
    ...IkonHeader.propTypes,
    ikon: PropTypes.bool
};

export default Bolk;
