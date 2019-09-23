import React from 'react';
import PropTypes from 'prop-types';
import FeedbackInput from '../FeedbackInput/FeedbackInput';
import Icon from 'nav-frontend-ikoner-assets';
import { Normaltekst } from 'nav-frontend-typografi';
import './IconRow.less';

const IconRow = ({ label, labelProp, value, bold, items }) => {
    const className = bold ? 'bold' : '';

    const itemsForFeedback =
        value && items
            ? [{ label, value }, ...items]
            : items
            ? items
            : value
            ? [{ label, value }]
            : [];
    return (
        <span className="IconRow">
            <span className="IconRow__left">
                <Icon kind="ok-sirkel-fyll" size={24} />
                <Normaltekst className={className}>
                    {label}
                    {labelProp && labelProp}
                </Normaltekst>
                <span className="divider" />
                {value && <Normaltekst className={className}>{value}</Normaltekst>}
            </span>
            <span className="IconRow__right">
                <FeedbackInput label={label} itemsForFeedback={itemsForFeedback} />
            </span>
        </span>
    );
};

IconRow.propTypes = {
    label: PropTypes.string.isRequired,
    labelProp: PropTypes.node,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bold: PropTypes.bool,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
    )
};

IconRow.defaultProps = {
    bold: false
};

export default IconRow;
