import React, { ReactChild, ReactChildren } from 'react';
import './List.less';

interface Props {
    children: ReactChild[] | ReactChild;
}

const List = ({ children }: Props) => {
    return <div className="List">{children}</div>;
};

export default List;
