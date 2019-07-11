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
                <div
                    className={
                        titleValue
                            ? 'IkonHeader--with-value'
                            : 'IkonHeader--without-value'
                    }
                >
                    <Normaltekst>{title}</Normaltekst>
                    <span className="IkonHeader__line" />
                </div>
                {titleValue && <Element>{titleValue}</Element>}
            </div>
        )}
        {items && (
            <div className={ikon ? 'IkonHeader__list' : ''}>
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
