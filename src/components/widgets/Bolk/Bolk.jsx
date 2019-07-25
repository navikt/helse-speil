import React from 'react';
import Uenigboks from '../Uenigboks';
import BolkHeader from '../BolkHeader';
import PropTypes from 'prop-types';
import './Bolk.css';

const Bolk = ({ title, titleValue, items, ikon }) => {
    return (
        <div className="bolk">
            <div className="vilkårskolonne">
                <BolkHeader
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
    ...BolkHeader.propTypes,
    ikon: PropTypes.bool
};

export default Bolk;
