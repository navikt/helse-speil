import React from 'react';
import Icon from 'nav-frontend-ikoner-assets';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import './IconRow.less';

const IconRow = ({ label, labelProp, bold = true, iconType = 'ok', hideIcon = false }) => {
    const className = bold ? 'bold' : '';
    const iconName = `${iconType}-sirkel-fyll`;

    return (
        <span className="IconRow">
            <span className="IconRow__left">
                {!hideIcon && <Icon kind={iconName} size={20} />}
                <Normaltekst className={className}>{label}</Normaltekst>
                {labelProp && <Normaltekst className={className}>{labelProp}</Normaltekst>}
            </span>
        </span>
    );
};

IconRow.propTypes = {
    label: PropTypes.string.isRequired,
    labelProp: PropTypes.node,
    bold: PropTypes.bool,
    iconType: PropTypes.string,
    hideIcon: PropTypes.bool
};

export default IconRow;
