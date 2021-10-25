import styled from '@emotion/styled';
import React, { ReactNode, useRef, useState } from 'react';

import { Popover, PopoverProps } from '@navikt/ds-react';

const StyledPopover = styled(Popover)`
    padding: 1rem 0.5rem;
    border: 1px solid #6a6a6a;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    width: max-content;

    .popover__pil {
        border-right: 1px solid #6a6a6a;
        border-bottom: 1px solid #6a6a6a;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
    }
`;

interface PopoverHjelpetekstProps extends Pick<PopoverProps, 'offset'> {
    ikon: ReactNode;
}

export const PopoverHjelpetekst: React.FC<PopoverHjelpetekstProps> = ({ children, ikon, ...rest }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);

    const close = () => setAnchor(null);

    return (
        <div>
            <div ref={ref} onMouseOver={(_) => setAnchor(ref.current!)} onMouseOut={close}>
                {ikon}
            </div>
            <StyledPopover open={anchor !== null} anchorEl={anchor} {...rest} onClose={close} placement="top">
                {children}
            </StyledPopover>
        </div>
    );
};
