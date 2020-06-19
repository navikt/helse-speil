import React, { useEffect } from 'react';

interface UseFocusOutsideOptions {
    ref: React.RefObject<HTMLElement>;
    onInteractOutside: () => void;
    active?: boolean;
}

export const useInteractOutside = ({ ref, active, onInteractOutside }: UseFocusOutsideOptions) => {
    useEffect(() => {
        const onInteractWrapper = (event: FocusEvent | MouseEvent) => {
            if (active && !ref.current?.contains(event.target as HTMLElement)) onInteractOutside();
        };
        document.addEventListener('focusin', onInteractWrapper);
        document.addEventListener('click', onInteractWrapper);
        return () => {
            document.removeEventListener('focusin', onInteractWrapper);
            document.removeEventListener('click', onInteractWrapper);
        };
    }, [ref.current, active]);
};
