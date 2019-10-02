import React from 'react';
import PropTypes from 'prop-types';
import FeedbackInput from '../FeedbackInput/FeedbackInput';
import { Normaltekst } from 'nav-frontend-typografi';
import './FormRow.less';

const FormRow = ({ label, value, bold, showRightSide }) => {
    const className = bold ? 'bold' : '';
    const itemsForFeedback = value !== undefined ? [{ label, value }] : [];
    return (
        <span className="FormRow">
            <span>
                <Normaltekst className={className}>{label}</Normaltekst>
                <Normaltekst className={className}>{value || '-'}</Normaltekst>
            </span>
            {showRightSide ? (
                <FeedbackInput label={label} itemsForFeedback={itemsForFeedback} />
            ) : (
                <div className="FormRow__padder" />
            )}
        </span>
    );
};

FormRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bold: PropTypes.bool,
    showRightSide: PropTypes.bool
};

FormRow.defaultProps = {
    bold: false,
    showRightSide: true
};

export default FormRow;
