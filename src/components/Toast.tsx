import { motion } from 'motion/react';
import React, { PropsWithChildren } from 'react';

import { Feilikon } from '@components/ikoner/Feilikon';
import { GrøntSjekkikon } from '@components/ikoner/GrøntSjekkikon';
import { useRemoveToast } from '@state/toasts';
import { cn } from '@utils/tw';

import styles from './Toast.module.css';

type ToastProps = {
    id: string;
    variant?: 'success' | 'error';
};

export const Toast = ({ id, children, variant }: PropsWithChildren<ToastProps>) => {
    const removeToast = useRemoveToast();
    return (
        <motion.div
            key={id}
            initial={{ y: 150, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                type: 'spring',
                damping: 25,
                mass: 1,
                stiffness: 300,
            }}
            layout
        >
            <button
                className={cn(styles.Toast, variant && styles[variant])}
                onClick={() => removeToast(id)}
                aria-live="polite"
            >
                {variant === 'success' && <GrøntSjekkikon />}
                {variant === 'error' && <Feilikon />}
                {children}
            </button>
        </motion.div>
    );
};
