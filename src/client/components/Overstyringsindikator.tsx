import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { BodyShort, Popover } from '@navikt/ds-react';

const Container = styled.span`
    position: absolute;
    top: 0;
    left: 0;
`;

const Text = styled(BodyShort)`
    white-space: nowrap;
    padding: 0.5rem 1rem;
    font-style: normal;
`;

interface OverstyringsindikatorProps {
    text?: string;
}

export const Overstyringsindikator: React.FC<OverstyringsindikatorProps> = ({
    text = 'Endringene vil oppdateres og kalkuleres etter du har trykket på ferdig',
}) => {
    const [showPopover, setShowPopover] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);

    return (
        <Container
            ref={containerRef}
            onMouseOver={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
            aria-label={text}
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 16V0H16L0 16Z" fill="#FF9100" />
            </svg>
            <Popover
                anchorEl={containerRef.current}
                open={showPopover}
                onClose={() => setShowPopover(false)}
                placement="top"
            >
                <Text as="p">{text}</Text>
            </Popover>
        </Container>
    );
};
