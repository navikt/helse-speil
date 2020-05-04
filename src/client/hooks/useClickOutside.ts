import React, { useEffect } from 'react';

interface UseClickOutsideOptions {
    ref: React.RefObject<HTMLElement>;
    onClickOutside: () => void;
    active?: boolean;
}

export const useClickOutside = ({ ref, active, onClickOutside }: UseClickOutsideOptions) => {
    useEffect(() => {
        const onClickWrapper = (event: MouseEvent) => {
            const modal = document.getElementById('modal');
            if (
                active &&
                !ref.current?.contains(event.target as HTMLElement) &&
                !modal?.contains(event.target as HTMLElement)
            )
                onClickOutside();
        };
        document.addEventListener('click', onClickWrapper);
        return () => document.removeEventListener('click', onClickWrapper);
    }, [ref.current, active]);
};
