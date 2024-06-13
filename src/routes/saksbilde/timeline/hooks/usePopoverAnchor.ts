import React, { useState } from 'react';

import { Maybe } from '@io/graphql';

type UsePopoverAnchorResult = {
    anchorEl: Maybe<HTMLElement>;
    open: boolean;
    onClose: () => void;
    onMouseOver: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseOut: (event: React.MouseEvent<HTMLElement>) => void;
};

export const usePopoverAnchor = (): UsePopoverAnchorResult => {
    const [anchor, setAnchor] = useState<Maybe<HTMLElement>>(null);

    const assignAnchor = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget);
    };

    const removeAnchor = () => {
        setAnchor(null);
    };

    return {
        anchorEl: anchor,
        open: anchor !== null,
        onClose: removeAnchor,
        onMouseOver: assignAnchor,
        onMouseOut: removeAnchor,
    };
};
