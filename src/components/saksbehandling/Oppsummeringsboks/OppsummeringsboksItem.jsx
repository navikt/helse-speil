import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import Icon, { IconType } from '../Icon/Icon';
import './OppsummeringsboksItem.less';

const OppsummeringsboksItem = ({ label, value, iconType, status }) => (
    <div className={`OppsummeringsboksItem ${status ? status : ''}`}>
        <Normaltekst>{label}</Normaltekst>
        {value && (
            <Normaltekst>
                {value}
                <Icon type={iconType} />
            </Normaltekst>
        )}
    </div>
);

export const OppsummeringsboksItemProps = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    iconType: PropTypes.oneOf(Object.values(IconType)),
    status: PropTypes.oneOf(['løst', 'uløst'])
};

OppsummeringsboksItem.propTypes = {
    ...OppsummeringsboksItemProps
};

export default OppsummeringsboksItem;
