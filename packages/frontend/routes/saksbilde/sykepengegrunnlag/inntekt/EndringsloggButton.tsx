import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';

import { EndringsloggArbeidsforhold } from '@components/EndringsloggArbeidsforhold';
import { EndringsloggDager } from '@components/EndringsloggDager';
import { EndringsloggInntekt } from '@components/EndringsloggInntekt';
import { Kilde } from '@components/Kilde';
import { useInteractOutside } from '@hooks/useInteractOutside';
import { Kildetype, Overstyring } from '@io/graphql';
import { isArbeidsforholdoverstyringer, isInntektoverstyringer, isOverstyringerPrDag } from '@utils/typeguards';

const Button = styled.button`
    position: relative;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    justify-content: center;
    outline: none;

    > div:hover {
        background-color: var(--navds-semantic-color-text);
        color: var(--navds-global-color-white);
    }
`;

interface EndringsloggButtonProps<T extends Overstyring> extends React.HTMLAttributes<HTMLButtonElement> {
    endringer: Array<T>;
}

export const EndringsloggButton = <T extends Overstyring>({
    endringer,
    ...buttonProps
}: EndringsloggButtonProps<T>) => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    const close = () => setVisEndringslogg(false);

    useInteractOutside({
        ref: buttonRef,
        active: visEndringslogg,
        onInteractOutside: close,
    });

    if (endringer.length === 0) {
        return null;
    }

    return (
        <>
            <Button type="button" ref={buttonRef} {...buttonProps} onClick={() => setVisEndringslogg(true)}>
                <Kilde type={Kildetype.Saksbehandler}>
                    <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                </Kilde>
            </Button>
            {isArbeidsforholdoverstyringer(endringer) ? (
                <EndringsloggArbeidsforhold endringer={endringer} isOpen={visEndringslogg} onRequestClose={close} />
            ) : isInntektoverstyringer(endringer) ? (
                <EndringsloggInntekt endringer={endringer} isOpen={visEndringslogg} onRequestClose={close} />
            ) : isOverstyringerPrDag(endringer) ? (
                <EndringsloggDager endringer={endringer} isOpen={visEndringslogg} onRequestClose={close} />
            ) : null}
        </>
    );
};
