import React from 'react';
import Ikon from 'nav-frontend-ikoner-assets';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './IkonHeader.css';

const IkonHeader = ({ title, titleValue, items, ikon }) => (
    <div className="IkonHeader">
        {title && (
            <div className="IkonHeader__status">
                {ikon && <Ikon kind="ok-sirkel-fyll" size={24} />}
                <Normaltekst>{title}</Normaltekst>
                <span className="IkonHeader__line" />
                {titleValue && (
                    <span className="IkonHeader__item">
                        <Element>{titleValue}</Element>
                    </span>
                )}
            </div>
        )}
        {items && (
            <div className="IkonHeader__list">
                {items.map((item, i) => (
                    <span
                        className="IkonHeader__item"
                        key={`${item.label}${i}`}
                    >
                        <Normaltekst>{item.label}</Normaltekst>
                        <Normaltekst>{item.value}</Normaltekst>
                    </span>
                ))}
            </div>
        )}
    </div>
);

IkonHeader.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    ),
    title: PropTypes.string,
    ikon: PropTypes.bool.isRequired,
    titleValue: PropTypes.string
};

export default IkonHeader;
