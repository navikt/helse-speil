import React from 'react';
import classNames from 'classnames';
import './ListSeparator.less';

enum SeparatorType {
    Dotted = 'dotted',
    Solid = 'solid',
    Transparent = 'transparent'
}

interface Props {
    type?: SeparatorType;
}

const ListSeparator = ({ type = SeparatorType.Solid }: Props) => <hr className={classNames('ListSeparator', type)} />;

export default ListSeparator;
