import React, { PropsWithChildren } from 'react';

import { Box } from '@navikt/ds-react';

import { LeggTilPeriodeSaksbildeMenu } from '@saksbilde/leggTilPeriode/LeggTilPeriodeSaksbildeMenu';

import styles from '../saksbilder/SharedViews.module.css';

export const LeggTilPeriodeSaksbilde = ({ children }: PropsWithChildren) => {
    return (
        <div className={styles.Content}>
            <LeggTilPeriodeSaksbildeMenu />
            <Box overflowX="auto">{children}</Box>
        </div>
    );
};
