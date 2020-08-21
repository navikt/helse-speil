import React, { ReactNode, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { AnimatePresence, motion, MotionStyle, Spring } from 'framer-motion';

const toastWidthPx = 200;

interface ToastProps {
    callback?: () => void;
    children: ReactNode | ReactNode[];
    timeToLiveMs?: number;
}

const ToastView = styled.div`
    display: flex;
    z-index: 1000;
    align-items: center;
    min-height: 1rem;
    width: ${toastWidthPx}px;
    padding: 0.75rem 1.25rem;
    border-radius: 4px;
    margin: 1rem;
    transform: translateX(50%);
    background: #3e3832;
    color: white;
`;

const spring: Spring = {
    type: 'spring',
    damping: 25,
    mass: 1,
    stiffness: 300,
};

const motionElementStyle: MotionStyle = {
    position: 'fixed',
    bottom: '1rem',
    right: `50%`,
};

export const Toast = React.memo(({ children, timeToLiveMs, callback }: ToastProps) => {
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
                <motion.div
                    key="toast"
                    initial={{ y: '150%', opacity: 1 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={spring}
                    style={motionElementStyle}
                >
                    <ToastView role="alert" aria-live="polite">
                        {children}
                    </ToastView>
                </motion.div>
            )}
        </AnimatePresence>
    );
});
