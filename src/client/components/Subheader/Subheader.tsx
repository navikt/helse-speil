import React, { ReactChild } from 'react';
import Row from '../Row';
// @ts-ignore
import Icon from 'nav-frontend-ikoner-assets';
import ListSeparator from '../ListSeparator';
import './Subheader.less';

interface Props {
    label: string;
    iconType?: 'ok' | 'advarsel';
    labelProp?: ReactChild;
}

const Subheader = ({ label, iconType, labelProp }: Props) => {
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

export default Subheader;
