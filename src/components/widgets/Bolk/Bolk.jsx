import React from 'react';
import Uenigboks from '../Uenigboks';
import IkonHeader from '../IkonHeader';
import PropTypes from 'prop-types';
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
            <Uenigboks label={title} />
        </div>
    );
};

Bolk.propTypes = {
    ...IkonHeader.propTypes,
    ikon: PropTypes.bool
};

export default Bolk;
