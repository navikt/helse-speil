import React from 'react';
import List from '../List';
import PropTypes from 'prop-types';
import Subheader from '../Subheader';
import './SubheaderWithList.less';

const SubheaderWithList = ({ label, labelProp, iconType, children }) => {
    return (
        <div className="SubheaderWithList">
            <Subheader label={label} iconType={iconType} labelProp={labelProp} />
            <List>{children}</List>
        </div>
    );
};

SubheaderWithList.propTypes = {
    label: PropTypes.string.isRequired,
    labelProp: PropTypes.node,
    iconType: PropTypes.oneOf(['ok', 'advarsel']),
    children: PropTypes.node
};

export default SubheaderWithList;
