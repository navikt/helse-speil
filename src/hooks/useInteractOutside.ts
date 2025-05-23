import React, { useEffect, useState } from 'react';

import { Maybe } from '@io/graphql';

interface UseFocusOutsideOptions {
    ref: React.RefObject<Maybe<HTMLElement>>;
    onInteractOutside: () => void;
    active?: boolean;
}

export const useInteractOutside = ({ ref, onInteractOutside, active = true }: UseFocusOutsideOptions) => {
    const [focused, setFocused] = useState(false);
    const [modalRef, setModalRef] = useState<Maybe<HTMLElement>>(null);

    const current = ref.current;

    useEffect(() => {
        const onInteract = (event: FocusEvent | MouseEvent) => {
            setTimeout(() => {
                const targetElement = event.target as HTMLElement;
                const targetIsModal = targetElement.id === 'modal';

                if (targetIsModal) {
                    setModalRef(targetElement);
                } else {
                    const shouldHaveFocus = current?.contains(targetElement) || modalRef?.contains(targetElement);
                    if (active) {
                        if (!shouldHaveFocus) onInteractOutside();
                        setFocused(shouldHaveFocus ?? false);
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
    }, [current, active, focused, modalRef, onInteractOutside]);
};
