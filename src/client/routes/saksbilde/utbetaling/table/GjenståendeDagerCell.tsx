import React from 'react';

interface GjenståendeDagerCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    gjenståendeDager?: number;
}

export const GjenståendeDagerCell = ({ gjenståendeDager, ...rest }: GjenståendeDagerCellProps) => (
    <td {...rest}>{gjenståendeDager}</td>
);
