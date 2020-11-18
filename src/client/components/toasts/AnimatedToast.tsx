import React, { CSSProperties } from 'react';
import styled from '@emotion/styled';
import { motion, MotionStyle, Spring } from 'framer-motion';

const ToastView = styled.div`
    display: flex;
    align-items: center;
    min-height: 1rem;
    padding: 14px 16px;
    border-radius: 4px;
    background: #3e3832;
    color: white;
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
`;

const spring: Spring = {
    type: 'spring',
    damping: 25,
    mass: 1,
    stiffness: 300,
};

const motionElementStyle: MotionStyle = {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    zIndex: 1000,
};

interface AnimatedToastProps {
    containerStyles?: CSSProperties;
    className?: string;
}

export const AnimatedToast: React.FC<AnimatedToastProps> = ({ children, className, containerStyles }) => {
    return (
        <motion.div
            key="toast"
            initial={{ y: '150%', opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={spring}
            style={{ ...motionElementStyle, ...containerStyles }}
        >
            <ToastView className={className} aria-live="polite">
                {children}
            </ToastView>
        </motion.div>
    );
};
