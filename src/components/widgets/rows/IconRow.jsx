import React from 'react';
import PropTypes from 'prop-types';
import Uenigboks from '../Uenigboks';
import Icon from 'nav-frontend-ikoner-assets';
import { Normaltekst } from 'nav-frontend-typografi';
import './IconRow.less';

const IconRow = ({ label, value, bold }) => {
    const className = bold ? 'bold' : '';

    return (
        <span className="IconRow">
            <span className="IconRow__left">
                <Icon kind="ok-sirkel-fyll" size={24} />
                <Normaltekst className={className}>{label}</Normaltekst>
                <span className="divider" />
                {value && (
                    <Normaltekst className={className}>{value}</Normaltekst>
                )}
            </span>
            <span className="IconRow__right">
                <Uenigboks label={label} />
            </span>
        </span>
    );
};

IconRow.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bold: PropTypes.bool
};

IconRow.defaultProps = {
    bold: false
};

export default IconRow;
