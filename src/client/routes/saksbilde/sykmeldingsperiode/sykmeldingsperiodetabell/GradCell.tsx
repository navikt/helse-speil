import React from 'react';

interface GradCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    grad?: number;
}

export const GradCell = ({ grad, ...rest }: GradCellProps) => <td {...rest}>{!!grad && `${grad} %`}</td>;
