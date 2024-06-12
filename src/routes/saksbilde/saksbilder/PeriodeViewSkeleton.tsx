import React, { ReactElement } from 'react';

import { SaksbildeMenuSkeleton } from '@/routes/saksbilde/saksbildeMenu/SaksbildeMenu';

import styles from './SharedViews.module.css';

export const PeriodeViewSkeleton = (): ReactElement => (
    <div className={styles.Content}>
        <SaksbildeMenuSkeleton />
    </div>
);
