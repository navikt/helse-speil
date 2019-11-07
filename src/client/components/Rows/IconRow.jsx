import React from 'react';
import PropTypes from 'prop-types';
import FeedbackInput from '../FeedbackInput/FeedbackInput';
import Icon from 'nav-frontend-ikoner-assets';
import { Normaltekst } from 'nav-frontend-typografi';
import './IconRow.less';

const IconRow = ({ label, labelProp, bold, items, displayFeedback }) => {
    const className = bold ? 'bold' : '';
    return (
        <span className="IconRow">
            <span className="IconRow__left">
                <Icon kind="ok-sirkel-fyll" size={24} />
                <Normaltekst className={className}>
                    {label}
                    {labelProp && labelProp}
                </Normaltekst>
                <span className="divider" />
            </span>
            {displayFeedback && (
                <span className="IconRow__right">
                    <FeedbackInput label={label} items={items} />
                </span>
            )}
        </span>
    );
};

IconRow.propTypes = {
    label: PropTypes.string.isRequired,
    labelProp: PropTypes.node,
    bold: PropTypes.bool,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
    ),
    displayFeedback: PropTypes.bool
};

IconRow.defaultProps = {
    bold: false
};

export default IconRow;
