import React from 'react';
import Row from '../Row/Row';
import Icon from 'nav-frontend-ikoner-assets';
import PropTypes from 'prop-types';
import ListSeparator from '../ListSeparator';
import './Subheader.less';

const Subheader = ({ label, iconType, labelProp }) => {
    return (
        <div className="Subheader">
            <span>
                {iconType && <Icon kind={`${iconType}-sirkel-fyll`} size={20} />}
                <Row label={label} labelProp={labelProp} />
            </span>
            <ListSeparator />
        </div>
    );
};

Subheader.propTypes = {
    label: PropTypes.string.isRequired,
    iconType: PropTypes.oneOf(['ok', 'advarsel']),
    labelProp: PropTypes.node
};

Subheader.defaultProps = {
    iconType: undefined
};

export default Subheader;
