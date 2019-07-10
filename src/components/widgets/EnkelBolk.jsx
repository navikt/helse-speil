import React from 'react';
import PropTypes from 'prop-types';
import EnigBoks from './EnigBoks';
import './Bolk.css';
import './EnkelBolk.css';
import { Element, Normaltekst } from 'nav-frontend-typografi';

const EnkelBolk = ({ title, value }) => {
    return (
        <div className="bolk">
            <div className="vilkårskolonne">
                {title && (
                    <div className="IkonHeader__status">
                        <div className="EnkelBolk_title">
                            <Normaltekst>{title}</Normaltekst>
                            <span className="IkonHeader__line" />
                        </div>
                        {value && <Element>{value}</Element>}
                    </div>
                )}
            </div>
            <EnigBoks />
        </div>
    );
};

EnkelBolk.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

export default EnkelBolk;
