import React, { ReactElement } from 'react';

import { SaksbildeMenuSkeleton } from '@/routes/saksbilde/saksbildeMenu/SaksbildeMenu';

import styles from './SharedViews.module.css';

function PeriodeViewSkeleton(): ReactElement {
    return (
        <div className={styles.Content}>
            <SaksbildeMenuSkeleton />
        </div>
    );
}

export default PeriodeViewSkeleton;
