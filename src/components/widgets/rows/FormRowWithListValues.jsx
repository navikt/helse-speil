import React from 'react';
import PropTypes from 'prop-types';
import Uenigboks from '../Uenigboks';
import { Normaltekst } from 'nav-frontend-typografi';
import './FormRowWithListValues.less';

const FormRow = ({ label, items, bold, showRightSide }) => {
    const className = bold ? 'bold' : '';
    const itemsForFeedback =
        items.length !== 0 ? [{ label, items: items.join(', ') }] : [];
    return (
        <span className="FormRowWithListValues">
            <span>
                <Normaltekst className={className}>{label}</Normaltekst>
                {items.length > 0 ? (
                    <span className="FormRow__List">
                        {items.map(item => (
                            <Normaltekst>{item}</Normaltekst>
                        ))}
                    </span>
                ) : (
                    <Normaltekst>-</Normaltekst>
                )}
            </span>
            {showRightSide ? (
                <Uenigboks label={label} itemsForFeedback={itemsForFeedback} />
            ) : (
                <div className="FormRow__padder" />
            )}
        </span>
    );
};

FormRow.propTypes = {
    label: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    bold: PropTypes.bool,
    showRightSide: PropTypes.bool
};

FormRow.defaultProps = {
    bold: false,
    showRightSide: true
};

export default FormRow;
