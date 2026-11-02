'use client';

import React from 'react';

import { Toast } from '@components/Toast';
import { useToasts } from '@state/toasts';

import styles from './Toasts.module.css';

export const Toasts = () => {
    const toasts = useToasts();

    return (
        <div className={styles.Toasts}>
            {toasts.map((it) => (
                <Toast variant={it.variant} key={it.key} id={it.key}>
                    {it.message}
                </Toast>
            ))}
        </div>
    );
};
