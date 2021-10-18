import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import '@navikt/helse-frontend-tooltip/lib/main.css';

import { Endringslogg } from '../../../../components/Endringslogg';
import { useInteractOutside } from '../../../../hooks/useInteractOutside';

const Overstyringknapp = styled.button`
    position: relative;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    width: 28px;
    display: flex;
    justify-content: center;
    outline: none;
`;

interface OverstyringsindikatorProps {
    overstyringer: Dagoverstyring[];
}

export const OverstyringsindikatorSaksbehandler = ({ overstyringer }: OverstyringsindikatorProps) => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleVisTooltip = () => setVisEndringslogg((prevState) => !prevState);

    useInteractOutside({
        ref: buttonRef,
        active: visEndringslogg,
        onInteractOutside: toggleVisTooltip,
    });

    return (
        <Overstyringknapp type="button" ref={buttonRef} onClick={() => setVisEndringslogg((value) => !value)}>
            <CaseworkerFilled height={20} width={20} />
            <Endringslogg
                overstyringer={overstyringer}
                isOpen={visEndringslogg}
                onRequestClose={() => setVisEndringslogg(false)}
            />
        </Overstyringknapp>
    );
};
