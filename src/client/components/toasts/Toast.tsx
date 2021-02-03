import React, { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedToast } from './AnimatedToast';

export interface ToastProps {
    key: string;
    children: ReactNode | ReactNode[];
    isShowing?: boolean;
}

export const Toast = ({ key, children, isShowing }: ToastProps) => (
    <>{isShowing && <AnimatedToast key={key}>{children}</AnimatedToast>}</>
);
