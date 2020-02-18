import React, { ReactChild } from 'react';
import Row from '../Row';
// @ts-ignore
import Icon from 'nav-frontend-ikoner-assets';
import ListSeparator from '../ListSeparator';
import './Subheader.less';
import classNames from 'classnames';
import IkonSjekk from '../Ikon/IkonSjekk';

type Ikontype = 'ok' | 'advarsel';

interface Props {
    label: string;
    ikontype?: Ikontype;
    labelProp?: ReactChild;
    className?: string;
}

const ikon = (type: Ikontype) => {
    switch (type) {
        case 'ok':
            return <IkonSjekk />;
        case 'advarsel':
            return <Icon kind={`advarsel-sirkel-fyll`} size={20} />;
    }
};

const Subheader = ({ label, ikontype, labelProp, className }: Props) => {
    return (
        <div className={classNames('Subheader', className)}>
            <span>
                {ikontype && ikon(ikontype)}
                <Row label={label} labelProp={labelProp} />
            </span>
            <ListSeparator />
        </div>
    );
};

export default Subheader;
