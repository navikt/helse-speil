import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import './Rows.less';

const Row = ({ label, children, labelProp }) => {
    return (
        <span className="Row">
            <Normaltekst>
                {label}
                {labelProp}
            </Normaltekst>
            {children && <Normaltekst>{children}</Normaltekst>}
        </span>
    );
};

Row.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    labelProp: PropTypes.node
};

Row.defaultProps = {
    bold: false
};

export default Row;
