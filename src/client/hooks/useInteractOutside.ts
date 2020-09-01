import React, { useEffect, useState } from 'react';

interface UseFocusOutsideOptions {
    ref: React.RefObject<HTMLElement>;
    onInteractOutside: () => void;
    active?: boolean;
}

export const useInteractOutside = ({ ref, active, onInteractOutside }: UseFocusOutsideOptions) => {
    const [focused, setFocused] = useState(false);
    useEffect(() => {
        const onInteractWrapper = (event: FocusEvent | MouseEvent) => {
            const shouldHaveFocus = !!ref.current?.contains(event.target as HTMLElement);
            if (active) {
                !shouldHaveFocus && onInteractOutside();
                setFocused(shouldHaveFocus);
            }
        };
        document.addEventListener('focusin', onInteractWrapper);
        document.addEventListener('click', onInteractWrapper);
        return () => {
            document.removeEventListener('focusin', onInteractWrapper);
            document.removeEventListener('click', onInteractWrapper);
        };
    }, [ref.current, active, focused]);
};
