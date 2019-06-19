import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import './Liste.css';

const Liste = ({ items }) => (
    <div className="Liste">
        {items.map((item, i) => (
            <span
                className="Liste__item"
                key={`${item.label}${i}`}
            >
                <Normaltekst>{item.label}</Normaltekst>
                <Normaltekst>{item.value}</Normaltekst>
            </span>
        ))}
    </div>
);

Liste.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    })).isRequired
};

export default Liste;
