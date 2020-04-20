import React, { useEffect } from 'react';

interface UseClickOutsideOptions {
    ref: React.RefObject<HTMLElement>;
    onClickOutside: () => void;
    active?: boolean;
}

export const useClickOutside = ({ ref, active, onClickOutside }: UseClickOutsideOptions) => {
    useEffect(() => {
        const onClickWrapper = (event: MouseEvent) => {
            if (active && !ref.current?.contains(event.target as HTMLElement)) onClickOutside();
        };
        document.addEventListener('mousedown', onClickWrapper);
        return () => document.removeEventListener('mousedown', onClickWrapper);
    }, [ref.current, active]);
};
