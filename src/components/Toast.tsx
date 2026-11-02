import { PropsWithChildren } from 'react';

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
        <div className="transition-transform duration-300 ease-out motion-reduce:transition-none starting:translate-y-[150px]">
            <button
                className={cn(styles.Toast, variant && styles[variant])}
                onClick={() => removeToast(id)}
                aria-live="polite"
            >
                {variant === 'success' && <GrøntSjekkikon />}
                {variant === 'error' && <Feilikon />}
                {children}
            </button>
        </div>
    );
};
