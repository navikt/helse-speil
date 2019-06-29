import React from 'react';
import Uenigboks from '../Uenigboks';
import IkonHeader from '../IkonHeader';
import './Bolk.css';

const Bolk = ({ title, items }) => {
    return (
        <div className="bolk">
            <div className="vilkårskolonne">
                <IkonHeader title={title} items={items} />
            </div>
            <Uenigboks id={title} />
        </div>
    );
};

Bolk.propTypes = {
    ...IkonHeader.propTypes
};

export default Bolk;
