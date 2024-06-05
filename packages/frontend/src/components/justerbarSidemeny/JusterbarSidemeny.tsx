import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';

import styles from './JusterbarSidemeny.module.css';

interface JusterbarSidebarProps {
    defaultBredde: number;
    visSidemeny: boolean;
    children: ReactNode;
    onChangeBredde?: (width: number) => void;
    className?: string;
    localStorageNavn?: string;
    åpnesTilVenstre?: boolean;
}

export const JusterbarSidemeny: React.FC<JusterbarSidebarProps> = ({
    visSidemeny,
    defaultBredde,
    children,
    localStorageNavn,
    className,
    onChangeBredde,
    åpnesTilVenstre = false,
}: JusterbarSidebarProps) => {
    const [width, setWidth] = useState(() =>
        localStorageNavn && typeof window !== 'undefined'
            ? parseInt(localStorage.getItem(localStorageNavn) || defaultBredde.toString())
            : defaultBredde,
    );
    const isResized = useRef(false);
    const minWidth = 50;
    const maxWidth = 1980;

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            if (!isResized.current) {
                return;
            }

            setWidth((previousWidth) => {
                const newWidth = previousWidth + (åpnesTilVenstre ? e.movementX : -e.movementX);
                const isWidthInRange = newWidth >= minWidth && newWidth <= maxWidth;

                return isWidthInRange ? newWidth : previousWidth;
            });
        });

        window.addEventListener('mouseup', () => {
            isResized.current = false;
        });
    }, []);

    useEffect(() => {
        if (!localStorageNavn) return;
        localStorage.setItem(localStorageNavn, `${width}`);
        if (onChangeBredde) onChangeBredde(width);
    }, [width]);

    useEffect(() => {
        if (!visSidemeny) {
            localStorageNavn && localStorage.removeItem(localStorageNavn);
            setWidth(defaultBredde);
        }
    }, [visSidemeny]);

    return (
        <div className={classNames(styles.justerbarSidemeny, className, åpnesTilVenstre && styles.venstre)}>
            <div
                className={classNames(styles.justerbarLinje, visSidemeny && styles.active)}
                onMouseDown={(e) => {
                    e.preventDefault();
                    isResized.current = true;
                }}
            />
            <div
                className={classNames(styles.innhold, visSidemeny && styles.active, åpnesTilVenstre && styles.venstre)}
                style={{ width: `${width}px` }}
            >
                {children}
            </div>
        </div>
    );
};
