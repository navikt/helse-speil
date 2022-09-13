import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';

import { toastsState } from '@state/toasts';
import { Toast } from '@components/Toast';

import styles from './Toasts.module.css';

export const Toasts = () => {
    const toasts = useRecoilValue(toastsState);

    return (
        <div className={styles.Toasts}>
            <AnimatePresence>
                {toasts.map((it) => (
                    <Toast variant={it.variant} key={it.key} id={it.key}>
                        {it.message}
                    </Toast>
                ))}
            </AnimatePresence>
        </div>
    );
};
