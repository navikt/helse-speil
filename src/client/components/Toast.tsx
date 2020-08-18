import React, { ReactNode, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import GrøntSjekkikon from './Ikon/GrøntSjekkikon';
import { AnimatePresence, motion } from 'framer-motion';
import Advarselikon from './Ikon/Advarselikon';

interface ToastProps {
    callback?: () => void;
    children: ReactNode | ReactNode[];
    timeToLiveMs?: number;
    type?: 'info' | 'advarsel' | 'suksess' | 'feil';
}

const ToastView = styled.div<{ type: 'info' | 'advarsel' | 'suksess' | 'feil' }>`
    display: flex;
    z-index: 1000;
    align-items: center;
    position: fixed;
    top: 1rem;
    left: 1rem;
    min-height: 1rem;
    min-width: 1rem;
    width: max-content;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    margin: 1rem;

    ${({ type }) => {
        switch (type) {
            case 'info':
                return `background: #e0f5fb; box-shadow: 0 0 0 3px #5690a2;`;
            case 'advarsel':
                return `background: #ffe9cc; box-shadow: 0 0 0 3px #d87f0a;`;
            case 'suksess':
                return `background: #cde7d8; box-shadow: 0 0 0 3px #06893a;`;
            case 'feil':
                return `background: #f1d8d4; box-shadow: 0 0 0 3px #ba3a26;`;
        }
    }}
`;

const AdvarselIkon = styled(Advarselikon)`
    margin-right: 0.5rem;
`;

const SuksessIkon = styled(GrøntSjekkikon)`
    margin-right: 0.5rem;
`;

export const SuksessToast = (props: ToastProps) => (
    <Toast {...props} type="suksess">
        <SuksessIkon />
        {props.children}
    </Toast>
);

export const AdvarselToast = (props: ToastProps) => (
    <Toast {...props} type="advarsel">
        <AdvarselIkon />
        {props.children}
    </Toast>
);

export const Toast = React.memo(({ children, timeToLiveMs = 5000, type = 'info', callback }: ToastProps) => {
    const [showing, setShowing] = useState(false);

    useEffect(() => {
        let timeouter: any;
        if (children) {
            setShowing(true);
            timeouter = setTimeout(() => {
                setShowing(false);
            }, timeToLiveMs);
        }
        return () => {
            clearTimeout(timeouter);
        };
    }, [children]);

    return (
        <AnimatePresence onExitComplete={() => callback?.()}>
            {showing && (
                <motion.div
                    key="toast"
                    initial={{ top: -10, opacity: 0 }}
                    animate={{ top: 0, opacity: 1 }}
                    exit={{ top: -10, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                    <ToastView role="alert" aria-live="polite" type={type}>
                        {children}
                    </ToastView>
                </motion.div>
            )}
        </AnimatePresence>
    );
});
