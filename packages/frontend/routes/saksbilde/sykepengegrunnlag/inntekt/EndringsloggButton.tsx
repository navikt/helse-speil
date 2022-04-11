import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';
import { useInteractOutside } from '@hooks/useInteractOutside';
import { Overstyring } from '@io/graphql';
import { isArbeidsforholdoverstyringer, isInntektoverstyringer, isOverstyringerPrDag } from '@utils/typeguards';
import { EndringsloggDager } from '@components/EndringsloggDager';
import { EndringsloggArbeidsforhold } from '@components/EndringsloggArbeidsforhold';
import { EndringsloggInntekt } from '@components/EndringsloggInntekt';

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
                <CaseworkerFilled height={20} width={20} />
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
