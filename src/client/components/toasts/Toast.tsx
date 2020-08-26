import React, { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AnimatedToast } from './AnimatedToast';

export interface ToastProps {
    children: ReactNode | ReactNode[];
    isShowing?: boolean;
}

export const Toast = ({ children, isShowing }: ToastProps) => (
    <AnimatePresence>{isShowing && <AnimatedToast>{children}</AnimatedToast>}</AnimatePresence>
);
