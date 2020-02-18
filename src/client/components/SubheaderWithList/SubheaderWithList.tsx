import React, { ReactChild } from 'react';
import List from '../List';
import Subheader from '../Subheader';
import './SubheaderWithList.less';

interface Props {
    label: string;
    iconType?: 'ok' | 'advarsel';
    children?: ReactChild | ReactChild[];
    labelProp?: ReactChild;
}

const SubheaderWithList = ({ label, labelProp, iconType, children }: Props) => {
    return (
        <div className="SubheaderWithList">
            <Subheader label={label} ikontype={iconType} labelProp={labelProp} />
            <List>{children}</List>
        </div>
    );
};

export default SubheaderWithList;
