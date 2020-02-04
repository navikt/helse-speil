import React, { ReactChild } from 'react';
import Row from '../Row';
// @ts-ignore
import Icon from 'nav-frontend-ikoner-assets';
import './IconRow.less';

interface Props {
    label: string;
    iconType?: 'ok' | 'advarsel';
}

const IconRow = ({ label, iconType }: Props) => {
    return (
        <div className="IconRow">
            <span>
                {iconType && <Icon kind={`${iconType}-sirkel-fyll`} size={20} />}
                <Row label={label} />
            </span>
        </div>
    );
};

export default IconRow;
