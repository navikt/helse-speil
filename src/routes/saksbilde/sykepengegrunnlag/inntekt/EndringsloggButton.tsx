import React, { useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';

import { Kilde } from '@components/Kilde';
import { EndringsloggArbeidsforhold } from '@components/endringslogg/EndringsloggArbeidsforhold';
import { EndringsloggDager } from '@components/endringslogg/EndringsloggDager';
import { EndringsloggInntekt } from '@components/endringslogg/EndringsloggInntekt';
import { useInteractOutside } from '@hooks/useInteractOutside';
import { Kildetype, Overstyring } from '@io/graphql';
import { isArbeidsforholdoverstyringer, isInntektoverstyringer, isOverstyringerPrDag } from '@utils/typeguards';

import styles from './EndringsloggButton.module.css';

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
            <button
                className={styles.button}
                type="button"
                ref={buttonRef}
                {...buttonProps}
                onClick={() => setVisEndringslogg(true)}
            >
                <Kilde type={Kildetype.Saksbehandler}>
                    <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                </Kilde>
            </button>
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
