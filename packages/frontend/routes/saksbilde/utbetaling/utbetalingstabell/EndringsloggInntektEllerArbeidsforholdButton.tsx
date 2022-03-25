import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';

import { EndringsloggInntekt, Endringstype } from '@components/EndringsloggInntekt';
import { useInteractOutside } from '@hooks/useInteractOutside';

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
    arbeidsforholdendringer: ExternalArbeidsforholdoverstyring[];
    inntektsendringer: ExternalInntektoverstyring[];
}

export const EndringsloggInntektEllerArbeidsforholdButton: React.VFC<EndringsloggInntektButtonProps> = ({
    arbeidsforholdendringer,
    inntektsendringer,
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

    const inntekter = inntektsendringer.map((it) => ({
        skjæringstidspunkt: it.overstyrtInntekt.skjæringstidspunkt,
        månedligInntekt: it.overstyrtInntekt.månedligInntekt,
        forklaring: it.overstyrtInntekt.forklaring,
        begrunnelse: it.begrunnelse,
        saksbehandlerIdent: it.saksbehandlerIdent ?? it.saksbehandlerNavn,
        timestamp: it.timestamp,
        type: 'Inntekt' as Endringstype,
    }));

    const arbeidsforhold = arbeidsforholdendringer.map((it) => ({
        skjæringstidspunkt: it.overstyrtArbeidsforhold.skjæringstidspunkt,
        deaktivert: it.overstyrtArbeidsforhold.deaktivert,
        forklaring: it.overstyrtArbeidsforhold.forklaring,
        begrunnelse: it.begrunnelse,
        saksbehandlerIdent: it.saksbehandlerIdent ?? it.saksbehandlerNavn,
        timestamp: it.timestamp,
        type: 'Arbeidsforhold' as Endringstype,
    }));

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
            <EndringsloggInntekt
                inntektsendringer={inntekter}
                arbeidsforholdendringer={arbeidsforhold}
                isOpen={visEndringslogg}
                onRequestClose={close}
            />
        </>
    );
};
