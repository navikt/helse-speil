import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import React, { useRef, useState } from 'react';

import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { Tooltip } from '@navikt/helse-frontend-tooltip';
import '@navikt/helse-frontend-tooltip/lib/main.css';

import { useInteractOutside } from '../../hooks/useInteractOutside';
import { NORSK_DATOFORMAT } from '../../utils/date';

import { IkonOverstyrt } from './ikoner/IkonOverstyrt';

interface OverstyringsindikatorProps {
    begrunnelse: string;
    saksbehandler: string;
    dato: Dayjs;
}

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

const StyledTooltip = styled(Tooltip)`
    width: 12rem;
    > p {
        text-align: left;
    }
`;

const Begrunnelsetekst = styled(Normaltekst)`
    color: var(--navds-color-text-inverse);
`;

const StyledUndertekst = styled(Undertekst)`
    font-style: italic;
`;

export const Overstyringsindikator = ({ begrunnelse, saksbehandler, dato }: OverstyringsindikatorProps) => {
    const [visTooltip, setVisTooltip] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleVisTooltip = () => setVisTooltip((prevState) => !prevState);

    useInteractOutside({
        ref: buttonRef,
        active: visTooltip,
        onInteractOutside: toggleVisTooltip,
    });
    return (
        <Overstyringknapp ref={buttonRef} onClick={() => setVisTooltip(true)}>
            <IkonOverstyrt />
            {visTooltip && (
                <StyledTooltip>
                    <Element>Begrunnelse</Element>
                    <Begrunnelsetekst>{begrunnelse}</Begrunnelsetekst>
                    <StyledUndertekst>
                        {saksbehandler}, {dato.format(NORSK_DATOFORMAT)}
                    </StyledUndertekst>
                </StyledTooltip>
            )}
        </Overstyringknapp>
    );
};
