import React, { ReactChild } from 'react';
import List from '../List';
import Vilkårsgruppe from '../../routes/Inngangsvilkår/Vilkårsgruppe';
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
            <Vilkårsgruppe tittel={label} ikontype={iconType} labelProp={labelProp} />
            <List>{children}</List>
        </div>
    );
};

export default SubheaderWithList;
