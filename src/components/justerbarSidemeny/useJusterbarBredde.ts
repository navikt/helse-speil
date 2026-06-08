import React, { useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 50;
const MAX_WIDTH = 1980;

interface UseJusterbarBreddeProps {
    defaultBredde: number;
    visSidemeny: boolean;
    localStorageNavn?: string;
    onChangeBredde?: (width: number) => void;
    åpnesTilVenstre: boolean;
}

export const useJusterbarBredde = ({
    defaultBredde,
    visSidemeny,
    localStorageNavn,
    onChangeBredde,
    åpnesTilVenstre,
}: UseJusterbarBreddeProps) => {
    const [width, setWidth] = useState(() => lesLagretBredde(localStorageNavn, defaultBredde));
    const [isDragging, setIsDragging] = useState(false);
    const isResized = useRef(false);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isResized.current) return;

            setWidth((previousWidth) => {
                const newWidth = previousWidth + (åpnesTilVenstre ? e.movementX : -e.movementX);
                return newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH ? newWidth : previousWidth;
            });
        };

        const onMouseUp = () => {
            isResized.current = false;
            setIsDragging(false);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [åpnesTilVenstre]);

    useEffect(() => {
        if (!localStorageNavn) return;
        if (visSidemeny) {
            localStorage.setItem(localStorageNavn, `${width}`);
        } else {
            localStorage.removeItem(localStorageNavn);
        }
        onChangeBredde?.(width);
    }, [localStorageNavn, onChangeBredde, visSidemeny, width]);

    const startDragging = (e: React.MouseEvent) => {
        e.preventDefault();
        isResized.current = true;
        setIsDragging(true);
    };

    return {
        visningsbredde: visSidemeny ? width : defaultBredde,
        isDragging,
        startDragging,
    };
};

function lesLagretBredde(localStorageNavn: string | undefined, defaultBredde: number): number {
    if (!localStorageNavn || typeof window === 'undefined') return defaultBredde;
    const lagret = Number.parseInt(localStorage.getItem(localStorageNavn) ?? '', 10);
    return Number.isFinite(lagret) ? lagret : defaultBredde;
}
