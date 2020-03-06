import React, { ReactChild, ReactChildren } from 'react';
import './List.less';
import classNames from 'classnames';

interface Props {
    children?: ReactChild[] | ReactChild;
    className?: string;
}

const List = ({ children, className }: Props) => {
    return <div className={classNames('List', className)}>{children}</div>;
};

export default List;
