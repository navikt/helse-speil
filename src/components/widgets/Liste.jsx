import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import './Liste.css';
import ListeItem from './ListeItem';

const Liste = ({ items, title }) => (
    <div className="Liste">
        {title && <Normaltekst>{title}</Normaltekst>}
        {items.map((item, i) => (
            <ListeItem key={`${item.label}${i}`} {...item} />
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
