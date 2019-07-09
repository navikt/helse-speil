import { Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import './InformasjonspanelItem.less';
import Icon, { IconType } from '../Icon/Icon';

const InformasjonspanelItem = ({ label, value, endret, iconType }) => (
    <span className="InformasjonspanelItem">
        {label && <Undertekst>{label}</Undertekst>}
        {value && <Undertekst>{value}</Undertekst>}
        <div className="InformasjonspanelItem__right">
            {endret && <Undertekst>Endret</Undertekst>}
            {iconType && <Icon type={iconType} />}
        </div>
    </span>
);

InformasjonspanelItem.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    endret: PropTypes.bool,
    iconType: PropTypes.oneOf(Object.values(IconType))
};

export default InformasjonspanelItem;
