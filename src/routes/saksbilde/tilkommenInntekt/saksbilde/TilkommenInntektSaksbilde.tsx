import React, { PropsWithChildren } from 'react';

import { Box } from '@navikt/ds-react';

import styles from '@saksbilde/saksbilder/SharedViews.module.css';
import { TilkommenInntektSaksbildeMenu } from '@saksbilde/tilkommenInntekt/saksbilde/TilkommenInntektSaksbildeMenu';

export const TilkommenInntektSaksbilde = ({ children }: PropsWithChildren) => {
    return (
        <div className={styles.Content}>
            <TilkommenInntektSaksbildeMenu />
            <Box overflowX="auto">{children}</Box>
        </div>
    );
};
