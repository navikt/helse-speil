import styled from '@emotion/styled';
import { motion, Spring } from 'framer-motion';
import React, { CSSProperties } from 'react';
import { css } from '@emotion/react';
import { GrøntSjekkikon } from '@components/ikoner/GrøntSjekkikon';
import { Feilikon } from '@components/ikoner/Feilikon';
import { useRemoveToast } from '@state/toasts';

const ToastView = styled.button<{ variant?: 'success' | 'error' }>`
    position: relative;
    display: flex;
    cursor: pointer;
    align-items: center;
    min-height: 1rem;
    padding: 14px 16px;
    border-radius: 4px;
    background: var(--navds-semantic-color-text);
    color: var(--navds-semantic-color-text-inverted);
    width: max-content;
    margin: 1rem;
    gap: 12px;
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
    border: 1px solid var(--navds-semantic-color-text);
    ${(props) => {
        switch (props.variant) {
            case 'success':
                return css`
                    background-color: var(--navds-alert-color-success-background);
                    border-color: var(--navds-alert-color-success-border);
                    color: var(--navds-semantic-color-text);
                `;
            case 'error':
                return css`
                    background-color: var(--navds-alert-color-error-background);
                    border-color: var(--navds-alert-color-error-border);
                    color: var(--navds-semantic-color-text);
                `;
            default:
                return null;
        }
    }}
`;

const spring: Spring = {
    type: 'spring',
    damping: 25,
    mass: 1,
    stiffness: 300,
};

interface AnimatedToastProps extends ChildrenProps {
    toastKey: string;
    containerStyles?: CSSProperties;
    className?: string;
    variant?: 'success' | 'error';
}

export const AnimatedToast: React.FC<AnimatedToastProps> = ({
    toastKey,
    children,
    className,
    containerStyles,
    variant,
}) => {
    const removeToast = useRemoveToast();
    return (
        <motion.div
            key={`framer-${toastKey}`}
            initial={{ y: '150', opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={spring}
            style={containerStyles}
            layout
        >
            <ToastView onClick={() => removeToast(toastKey)} variant={variant} className={className} aria-live="polite">
                {variant === 'success' && <GrøntSjekkikon />}
                {variant === 'error' && <Feilikon />}
                {children}
            </ToastView>
        </motion.div>
    );
};
