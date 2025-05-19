import React, { PropsWithChildren } from 'react';

import { Box } from '@navikt/ds-react';

import { TilkommenInntektSaksbildeMenu } from '@saksbilde/tilkommenInntekt/saksbilde/TilkommenInntektSaksbildeMenu';

import styles from '../../saksbilder/SharedViews.module.css';

export const TilkommenInntektSaksbilde = ({ children }: PropsWithChildren) => {
    return (
        <div className={styles.Content}>
            <TilkommenInntektSaksbildeMenu />
            <Box overflowX="auto" height="100%">
                {children}
            </Box>
        </div>
    );
};
