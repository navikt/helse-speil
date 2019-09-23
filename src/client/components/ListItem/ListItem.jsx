import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import classNames from 'classnames';
import './ListItem.less';

const ListItem = ({ label, value, bold }) => (
    <span className={classNames('ListItem', bold ? 'bold' : '')}>
        <Normaltekst>{label}</Normaltekst>
        <Normaltekst>{value}</Normaltekst>
    </span>
);

ListItem.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]).isRequired,
    bold: PropTypes.bool
};

ListItem.defaultProps = {
    bold: false
};

export default ListItem;
