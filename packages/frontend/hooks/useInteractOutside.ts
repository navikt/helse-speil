import React, { useEffect, useState } from 'react';

interface UseFocusOutsideOptions {
    ref: React.RefObject<HTMLElement>;
    onInteractOutside: () => void;
    active?: boolean;
}

export const useInteractOutside = ({ ref, onInteractOutside, active = true }: UseFocusOutsideOptions) => {
    const [focused, setFocused] = useState(false);
    const [modalRef, setModalRef] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const onInteract = (event: FocusEvent | MouseEvent) => {
            setTimeout(() => {
                const targetElement = event.target as HTMLElement;
                const targetIsModal = targetElement.id === 'modal';

                if (targetIsModal) {
                    setModalRef(targetElement);
                } else {
                    const shouldHaveFocus =
                        !!ref.current?.contains(targetElement) || !!modalRef?.contains(targetElement);
                    if (active) {
                        !shouldHaveFocus && onInteractOutside();
                        setFocused(shouldHaveFocus);
                    }
                }
            }, 0);
        };
        document.addEventListener('focusin', onInteract);
        document.addEventListener('click', onInteract);
        return () => {
            document.removeEventListener('focusin', onInteract);
            document.removeEventListener('click', onInteract);
        };
    }, [ref.current, active, focused, modalRef]);
};
