import React, { ReactElement, ReactNode } from 'react';

import { Antall } from '@io/graphql';

interface StatistikkRowProps {
    children: ReactNode;
    antall: Antall;
}

export const StatistikkRow = ({ children, antall }: StatistikkRowProps): ReactElement => {
    return (
        <tr>
            <td>{children}</td>
            <td>{antall.manuelt}</td>
            <td>{antall.automatisk}</td>
            <td>{antall.tilgjengelig}</td>
        </tr>
    );
};
