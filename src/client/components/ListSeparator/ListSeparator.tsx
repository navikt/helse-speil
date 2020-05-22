import React from 'react';
import classNames from 'classnames';
import './ListSeparator.less';

enum SeparatorType {
    Dotted = 'dotted',
    Solid = 'solid',
    Transparent = 'transparent',
}

interface Props {
    type?: SeparatorType;
    className?: string;
}

const ListSeparator = ({ className, type = SeparatorType.Solid }: Props) => (
    <hr className={classNames('ListSeparator', className, type)} />
);

export default ListSeparator;
