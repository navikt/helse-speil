import { Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import './InformasjonspanelItem.less';

export const IconType = {
    AAREGISTERET: 'aaregisteret',
    INNTEKSTMELDING: 'inntekstmelding'
};

const InformasjonspanelItem = ({ label, value, endret, iconType }) => (
    <span className="InformasjonspanelItem">
        {label && <Undertekst>{label}</Undertekst>}
        {value && <Undertekst>{value}</Undertekst>}
        <div className="InformasjonspanelItem__right">
            {endret && <Undertekst>Endret</Undertekst>}
            {iconType && (
                <div
                    className={`icon-${iconType}`}
                    aria-label={iconType}
                    title={iconType}
                />
            )}
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
