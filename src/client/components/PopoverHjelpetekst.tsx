import styled from '@emotion/styled';
import React, { ReactNode, useRef, useState } from 'react';

import Popover, { PopoverProps } from 'nav-frontend-popover';

interface PopoverHjelpetekstProps extends Omit<PopoverProps, 'onRequestClose'> {
    children: ReactNode;
    ikon: ReactNode;
}

const StyledPopover = styled(Popover)`
    padding: 1rem 0.5rem;
    border: 1px solid #6a6a6a;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 2px;

    .popover__pil {
        border-right: 1px solid #6a6a6a;
        border-bottom: 1px solid #6a6a6a;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
    }
`;

export const PopoverHjelpetekst = ({ children, ikon, ...rest }: PopoverHjelpetekstProps) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [anchor, setAnchor] = useState<HTMLButtonElement | undefined>(undefined);

    return (
        <div>
            <span ref={ref} onMouseOver={(_) => setAnchor(ref.current!)} onMouseOut={() => setAnchor(undefined)}>
                {ikon}
            </span>
            <StyledPopover autoFokus={false} ankerEl={anchor} {...rest}>
                {children}
            </StyledPopover>
        </div>
    );
};
