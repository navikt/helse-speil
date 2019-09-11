import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import classNames from 'classnames';
import './ListeItem.css';

const ListeItem = ({ label, value, bold }) => (
    <span className={classNames('ListeItem', bold ? 'bold' : '')}>
        <Normaltekst>{label}</Normaltekst>
        <Normaltekst>{value}</Normaltekst>
    </span>
);

ListeItem.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
    bold: PropTypes.bool
};

ListeItem.defaultProps = {
    bold: false
};

export default ListeItem;
