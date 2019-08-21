import React from 'react';
import Uenigboks from '../../widgets/Uenigboks';
import '../../widgets/Bolk/Bolk.css';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';

const BolkMedKnapp = ({ title, items, onClick }) => {
    return (
        <div className="bolk">
            <div className="vilkårskolonne">
                <div className="BolkHeader">
                    <div className="BolkHeader__status">
                        <div className="BolkHeader--without-value">
                            <Element>
                                {title}{' '}
                                <button onClick={onClick}>
                                    (Vis detaljer)
                                </button>
                            </Element>
                            <span className="BolkHeader__line" />
                        </div>
                    </div>
                    {items && (
                        <div>
                            {items.map((item, i) => (
                                <span
                                    className="BolkHeader__item"
                                    key={`${item.label}${i}`}
                                >
                                    <Normaltekst>{item.label}</Normaltekst>
                                    <Normaltekst>{item.value}</Normaltekst>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Uenigboks label={title} />
        </div>
    );
};

BolkMedKnapp.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    ).isRequired,
    onClick: PropTypes.func.isRequired
};

export default BolkMedKnapp;
