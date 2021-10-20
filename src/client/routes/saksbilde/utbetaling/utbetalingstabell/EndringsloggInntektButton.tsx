import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import '@navikt/helse-frontend-tooltip/lib/main.css';

import { EndringsloggOverstyrtInntekt } from '../../../../components/EndringsloggOverstyrtInntekt';
import { useInteractOutside } from '../../../../hooks/useInteractOutside';

const Button = styled.button`
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

interface EndringsloggInntektButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    endringer: ExternalInntektoverstyring[];
}

export const EndringsloggInntektButton: React.VFC<EndringsloggInntektButtonProps> = ({
    endringer,
    className,
    ...buttonProps
}) => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const close = () => setVisEndringslogg(false);

    useInteractOutside({
        ref: buttonRef,
        active: visEndringslogg,
        onInteractOutside: close,
    });

    return (
        <>
            <Button
                type="button"
                className={className}
                ref={buttonRef}
                {...buttonProps}
                onClick={() => setVisEndringslogg(true)}
            >
                <CaseworkerFilled height={20} width={20} />
            </Button>
            <EndringsloggOverstyrtInntekt
                endringer={endringer.map((it) => ({
                    skjæringstidspunkt: it.overstyrtInntekt.skjæringstidspunkt,
                    månedligInntekt: it.overstyrtInntekt.månedligInntekt,
                    forklaring: it.overstyrtInntekt.forklaring,
                    begrunnelse: it.begrunnelse,
                    saksbehandlerIdent: it.saksbehandlerIdent ?? it.saksbehandlerNavn,
                    timestamp: it.timestamp,
                }))}
                isOpen={visEndringslogg}
                onRequestClose={close}
            />
        </>
    );
};
