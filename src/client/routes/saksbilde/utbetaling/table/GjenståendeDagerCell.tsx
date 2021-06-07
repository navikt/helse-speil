import React from 'react';

interface GjenståendeDagerCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
    gjenståendeDager?: number;
}

export const GjenståendeDagerCell = ({ gjenståendeDager, ...rest }: GjenståendeDagerCellProps) => {
    return <td {...rest}>{gjenståendeDager}</td>;
};
