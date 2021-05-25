import React, { ReactNode } from 'react';

import { AnimatedToast } from './AnimatedToast';

export interface ToastProps {
    toastKey: string;
    children: ReactNode | ReactNode[];
    isShowing?: boolean;
}

export const Toast = ({ toastKey, children, isShowing }: ToastProps) => (
    <>{isShowing && <AnimatedToast toastKey={toastKey}>{children}</AnimatedToast>}</>
);
