import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';

import { EndringsloggInntekt } from '@components/EndringsloggInntekt';
import { useInteractOutside } from '@hooks/useInteractOutside';
import { Arbeidsforholdoverstyring, Inntektoverstyring } from '@io/graphql';

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
    arbeidsforholdendringer: Arbeidsforholdoverstyring[];
    inntektsendringer: Inntektoverstyring[];
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
        skjæringstidspunkt: it.inntekt.skjaeringstidspunkt,
        månedligInntekt: it.inntekt.manedligInntekt,
        forklaring: it.inntekt.forklaring,
        begrunnelse: it.begrunnelse,
        saksbehandlerIdent: it.saksbehandler.ident ?? it.saksbehandler.navn,
        timestamp: it.timestamp,
        type: 'Inntekt',
    }));

    const arbeidsforhold = arbeidsforholdendringer.map((it) => ({
        skjæringstidspunkt: it.skjaeringstidspunkt,
        deaktivert: it.deaktivert,
        forklaring: it.forklaring,
        begrunnelse: it.begrunnelse,
        saksbehandlerIdent: it.saksbehandler.ident ?? it.saksbehandler.navn,
        timestamp: it.timestamp,
        type: 'Arbeidsforhold',
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
