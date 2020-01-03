import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import './ListItem.less';

const ListItem = ({ label, children }) => (
    <>
        <Normaltekst>{label}</Normaltekst>
        <Normaltekst>{children}</Normaltekst>
    </>
);

ListItem.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])
};

export default ListItem;
