import React from 'react';
import Ikon from 'nav-frontend-ikoner-assets';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './BolkHeader.css';

const BolkHeader = ({ title, titleValue, items, ikon }) => (
    <div className="BolkHeader">
        {title && (
            <div className="BolkHeader__status">
                {ikon && <Ikon kind="ok-sirkel-fyll" size={24} />}
                <div
                    className={
                        titleValue
                            ? 'BolkHeader--with-value'
                            : 'BolkHeader--without-value'
                    }
                >
                    <Normaltekst>{title}</Normaltekst>
                    <span className="BolkHeader__line" />
                </div>
                {titleValue && <Element>{titleValue}</Element>}
            </div>
        )}
        {items && (
            <div className={ikon ? 'BolkHeader__list' : ''}>
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
);

BolkHeader.defaultProps = {
    ikon: true
};

BolkHeader.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    ),
    title: PropTypes.string,
    ikon: PropTypes.bool,
    titleValue: PropTypes.string
};

export default BolkHeader;
