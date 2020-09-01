import { Dayjs } from 'dayjs';
import React, { useRef, useState } from 'react';
import { Tooltip } from '@navikt/helse-frontend-tooltip';
import '@navikt/helse-frontend-tooltip/lib/main.css';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { NORSK_DATOFORMAT } from '../utils/date';
import styled from '@emotion/styled';
import { IkonOverstyrt } from './tabell/ikoner/IkonOverstyrt';
import { useInteractOutside } from '../hooks/useInteractOutside';

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
`;

const Overstyrtikon = styled(IkonOverstyrt)`
    display: flex;
    margin-left: -0.5rem;
`;

const StyledTooltip = styled(Tooltip)`
    width: 12rem;
    > p {
        text-align: left;
    }
`;

const Begrunnelsetekst = styled(Normaltekst)`
    color: #ffffff;
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
        <Overstyringknapp ref={buttonRef} onClick={toggleVisTooltip}>
            <Overstyrtikon />
            {visTooltip && (
                <StyledTooltip>
                    <Element>Vurdering</Element>
                    <Begrunnelsetekst>{begrunnelse}</Begrunnelsetekst>
                    <StyledUndertekst>
                        {saksbehandler}, {dato.format(NORSK_DATOFORMAT)}
                    </StyledUndertekst>
                </StyledTooltip>
            )}
        </Overstyringknapp>
    );
};
