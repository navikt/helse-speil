import React, { PropsWithChildren, ReactElement } from 'react';

import { Antall } from '@io/graphql';

interface StatistikkRowProps {
    antall: Antall;
}

export const StatistikkRow = ({ children, antall }: PropsWithChildren<StatistikkRowProps>): ReactElement => {
    return (
        <tr>
            <td>{children}</td>
            <td>{antall.manuelt}</td>
            <td>{antall.automatisk}</td>
            <td>{antall.tilgjengelig}</td>
        </tr>
    );
};
