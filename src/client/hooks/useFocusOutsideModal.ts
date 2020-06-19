import React, { useEffect } from 'react';

interface UseFocusOutsideOptions {
    ref: React.RefObject<HTMLElement>;
    onFocusOutside: () => void;
    active?: boolean;
}

export const useFocusOutsideModal = ({ ref, active, onFocusOutside }: UseFocusOutsideOptions) => {
    useEffect(() => {
        const onFocusWrapper = (event: FocusEvent) => {
            const modal = document.getElementById('modal');
            if (
                active &&
                !ref.current?.contains(event.target as HTMLElement) &&
                !modal?.contains(event.target as HTMLElement)
            )
                onFocusOutside();
        };
        document.addEventListener('focusin', onFocusWrapper);
        return () => document.removeEventListener('focusin', onFocusWrapper);
    }, [ref.current, active]);
};
