import styled from '@emotion/styled';
import { motion, Spring } from 'framer-motion';
import React, { CSSProperties } from 'react';

const ToastView = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    min-height: 1rem;
    padding: 14px 16px;
    border-radius: 4px;
    background: var(--navds-color-text-primary);
    color: white;
    width: max-content;
    margin: 1rem;
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
`;

const spring: Spring = {
    type: 'spring',
    damping: 25,
    mass: 1,
    stiffness: 300,
};

interface AnimatedToastProps {
    toastKey: string;
    containerStyles?: CSSProperties;
    className?: string;
}

export const AnimatedToast: React.FC<AnimatedToastProps> = ({ toastKey, children, className, containerStyles }) => {
    return (
        <motion.div
            key={`framer-${toastKey}`}
            initial={{ y: '150%', opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={spring}
            style={containerStyles}
        >
            <ToastView className={className} aria-live="polite">
                {children}
            </ToastView>
        </motion.div>
    );
};
