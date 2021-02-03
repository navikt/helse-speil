import React, { CSSProperties, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedToast } from './AnimatedToast';
import { ToastProps } from './Toast';

interface TimeoutToastProps extends ToastProps {
    key: string;
    className?: string;
    callback?: () => void;
    timeToLiveMs?: number;
    containerStyles?: CSSProperties;
}

export const TimeoutToast = React.memo(
    ({ key, children, timeToLiveMs, callback, className, containerStyles }: TimeoutToastProps) => {
        const [showing, setShowing] = useState(true);

        useEffect(() => {
            let timeoutId: any;
            if (children && !!timeToLiveMs) {
                timeoutId = setTimeout(() => {
                    setShowing(false);
                    callback?.();
                }, timeToLiveMs);
            }
            return () => {
                callback?.();
                !!timeoutId && clearTimeout(timeoutId);
            };
        }, [children, timeToLiveMs]);

        return (
            <AnimatePresence onExitComplete={() => callback?.()}>
                {showing && (
                    <AnimatedToast key={key} containerStyles={containerStyles} className={className}>
                        {children}
                    </AnimatedToast>
                )}
            </AnimatePresence>
        );
    }
);
