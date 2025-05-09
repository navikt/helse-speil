import React, { PropsWithChildren } from 'react';

import { TilkommenInntektSaksbildeMenu } from '@saksbilde/tilkommenInntekt/TilkommenInntektSaksbildeMenu';

import styles from '../saksbilder/SharedViews.module.css';

export const TilkommenInntektSaksbilde = ({ children }: PropsWithChildren) => {
    return (
        <div className={styles.Content}>
            <TilkommenInntektSaksbildeMenu />
            {children}
        </div>
    );
};
