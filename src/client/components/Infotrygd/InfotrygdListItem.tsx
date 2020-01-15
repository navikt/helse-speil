import React, { ReactChild, ReactChildren } from 'react';

interface Props {
    label?: string;
    status?: string;
    children?: ReactChild | ReactChildren;
}

const InfotrygdListItem = ({ label, status, children }: Props) => {
    return (
        <>
            <span className="InfotrygdListItem__status">{status ?? ''}</span>
            <span className="InfotrygdListItem__label">{label}</span>
            <span className="InfotrygdListItem__children">{children}</span>
        </>
    );
};

export default InfotrygdListItem;
