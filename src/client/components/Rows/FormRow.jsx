import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import './FormRow.less';

const FormRow = ({ label, value, bold = true }) => {
    const className = bold ? 'bold' : '';
    return (
        <>
            <span className="FormRow">
                <Normaltekst className={className}>{label}</Normaltekst>
                <Normaltekst className={className}>{value || '-'}</Normaltekst>
            </span>
            <hr className="RowSeparator" />
        </>
    );
};

FormRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bold: PropTypes.bool
};

FormRow.defaultProps = {
    bold: false,
    showRightSide: true
};

export default FormRow;
