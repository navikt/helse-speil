import React, { CSSProperties, useEffect } from 'react';

import { useRemoveToast } from '../../state/toasts';

import { AnimatedToast } from './AnimatedToast';
import { ToastProps } from './Toast';

interface TimeoutToastProps extends ToastProps {
    toastKey: string;
    timeToLiveMs: number;
    className?: string;
    callback?: () => void;
    containerStyles?: CSSProperties;
}

export const TimeoutToast = ({
    toastKey,
    children,
    timeToLiveMs,
    callback,
    className,
    containerStyles,
}: TimeoutToastProps) => {
    const removeToast = useRemoveToast();

    const onRemove = () => {
        callback?.();
        removeToast(toastKey);
    };

    useEffect(() => {
        let timeoutId = setTimeout(onRemove, timeToLiveMs);
        return () => {
            clearTimeout(timeoutId);
            onRemove();
        };
    }, [children, timeToLiveMs]);

    return (
        <AnimatedToast toastKey={toastKey} containerStyles={containerStyles} className={className}>
            {children}
        </AnimatedToast>
    );
};
