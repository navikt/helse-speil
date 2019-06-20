import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import './Liste.css';

const Liste = ({ items, title }) => (
    <div className="Liste">
        {title && <Normaltekst>{title}</Normaltekst>}
        {items.map((item, i) => (
            <span className="Liste__item" key={`${item.label}${i}`}>
                <Normaltekst>{item.label}</Normaltekst>
                <Normaltekst>{item.value}</Normaltekst>
            </span>
        ))}
    </div>
);

Liste.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    ).isRequired,
    title: PropTypes.string
};

export default Liste;
