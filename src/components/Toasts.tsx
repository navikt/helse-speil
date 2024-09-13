'use client';

import { AnimatePresence } from 'framer-motion';
import React from 'react';

import { Toast } from '@components/Toast';
import { useToasts } from '@state/toasts';

import styles from './Toasts.module.css';

export const Toasts = () => {
    const toasts = useToasts();

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
