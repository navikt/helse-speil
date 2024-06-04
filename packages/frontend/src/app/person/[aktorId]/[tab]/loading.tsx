'use client';

import React, { ReactElement } from 'react';

import { Historikk } from '@/routes/saksbilde/historikk';
import { SaksbildeMenu } from '@/routes/saksbilde/saksbildeMenu/SaksbildeMenu';
import styles from '@/routes/saksbilde/saksbilder/PeriodeView.module.css';
import { Venstremeny } from '@/routes/saksbilde/venstremeny/Venstremeny';

function Loading(): ReactElement {
    return (
        <>
            <Venstremeny />
            <div className={styles.content}>
                <SaksbildeMenu />
            </div>
            <Historikk />
        </>
    );
}

export default Loading;
