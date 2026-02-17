import React, { useState } from 'react';

type PopoverAnchor = {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
    onMouseOver: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseOut: (event: React.MouseEvent<HTMLElement>) => void;
    toggle: (element: HTMLElement) => void;
    hide: () => void;
};

export function usePopoverAnchor(): PopoverAnchor {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const toggle = (element: HTMLElement) => {
        setAnchor((prev) => (prev ? null : element));
    };

    const hide = () => {
        setAnchor(null);
    };

    const assignAnchor = (event: React.MouseEvent<HTMLElement>) => {
        toggle(event.currentTarget);
    };

    return {
        anchorEl: anchor,
        open: anchor !== null,
        onClose: hide,
        onMouseOver: assignAnchor,
        onMouseOut: hide,
        toggle,
        hide,
    };
}
