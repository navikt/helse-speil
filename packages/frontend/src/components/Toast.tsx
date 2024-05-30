import classNames from 'classnames';
import { motion } from 'framer-motion';
import React from 'react';

import { Feilikon } from '@components/ikoner/Feilikon';
import { GrøntSjekkikon } from '@components/ikoner/GrøntSjekkikon';
import { useRemoveToast } from '@state/toasts';

import styles from './Toast.module.css';

interface ToastProps extends ChildrenProps {
    id: string;
    variant?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ id, children, variant }) => {
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
                className={classNames(styles.Toast, variant && styles[variant])}
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
