import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { Checkbox as NavCheckbox, Popover } from '@navikt/ds-react';

const Container = styled.div`
    position: relative;
    padding: 1rem;
    background: #fff;

    > div {
        position: absolute;
        padding: 0;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        > input {
            max-height: 2rem;
            max-width: 2rem;
        }
    }
`;

const Checkbox = styled(NavCheckbox)`
    > input[type='checkbox'] {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
`;

const LabelContainer = styled.div`
    padding: 0.5rem 1rem;
    white-space: nowrap;
`;

export const DisabledCheckbox = ({ label }: { label: string }) => {
    const ref = useRef<HTMLInputElement>(null);

    const [showPopover, setShowPopover] = useState(false);

    return (
        <Container>
            <Checkbox checked={false} hideLabel ref={ref} onClick={() => setShowPopover(true)}>
                {label}
            </Checkbox>
            <Popover anchorEl={ref.current} open={showPopover} onClose={() => setShowPopover(false)} placement="top">
                <LabelContainer>{label}</LabelContainer>
            </Popover>
        </Container>
    );
};
