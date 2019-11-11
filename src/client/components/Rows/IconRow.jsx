import React from 'react';
import Icon from 'nav-frontend-ikoner-assets';
import PropTypes from 'prop-types';
import FeedbackInput from '../FeedbackInput/FeedbackInput';
import { Normaltekst } from 'nav-frontend-typografi';
import './IconRow.less';

const IconRow = ({ label, labelProp, bold, items, displayFeedback, displayIcon }) => {
    const className = bold ? 'bold' : '';
    return (
        <>
            <span className="IconRow">
                <span className="IconRow__left">
                    {displayIcon && <Icon kind="ok-sirkel-fyll" size={20} />}
                    <Normaltekst className={className}>{label}</Normaltekst>
                    {labelProp && <Normaltekst className={className}>{labelProp}</Normaltekst>}
                </span>
                {displayFeedback && (
                    <span className="IconRow__right">
                        <FeedbackInput label={label} items={items} />
                    </span>
                )}
            </span>
        </>
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
    displayFeedback: PropTypes.bool,
    displayIcon: PropTypes.bool
};

IconRow.defaultProps = {
    bold: false
};

export default IconRow;
