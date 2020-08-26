import React, { CSSProperties, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedToast } from './AnimatedToast';
import { ToastProps } from './Toast';

interface TimeoutToastProps extends ToastProps {
    className?: string;
    callback?: () => void;
    timeToLiveMs?: number;
    containerStyles?: CSSProperties;
}

export const TimeoutToast = React.memo(
    ({ children, timeToLiveMs, callback, className, containerStyles }: TimeoutToastProps) => {
        const [showing, setShowing] = useState(true);

        useEffect(() => {
            let timeoutId: any;
            if (children && !!timeToLiveMs) {
                timeoutId = setTimeout(() => {
                    setShowing(false);
                }, timeToLiveMs);
            }
            return () => {
                !!timeoutId && clearTimeout(timeoutId);
            };
        }, [children, timeToLiveMs]);

        return (
            <AnimatePresence onExitComplete={() => callback?.()}>
                {showing && (
                    <AnimatedToast containerStyles={containerStyles} className={className}>
                        {children}
                    </AnimatedToast>
                )}
            </AnimatePresence>
        );
    }
);
