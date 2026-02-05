import React, { ReactElement, useRef, useState } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { EndringsloggArbeidsforhold } from '@components/endringslogg/EndringsloggArbeidsforhold';
import { EndringsloggDager } from '@components/endringslogg/EndringsloggDager';
import { EndringsloggInntekt } from '@components/endringslogg/EndringsloggInntekt';
import { OverstyringFragment } from '@io/graphql';
import { cn } from '@utils/tw';
import { isArbeidsforholdoverstyringer, isInntektoverstyringer, isOverstyringerPrDag } from '@utils/typeguards';

import styles from './EndringsloggButton.module.css';

interface EndringsloggButtonProps<T extends OverstyringFragment> extends React.HTMLAttributes<HTMLButtonElement> {
    endringer: T[];
}

export const EndringsloggButton = <T extends OverstyringFragment>({
    endringer,
    className,
    ...buttonProps
}: EndringsloggButtonProps<T>): ReactElement | null => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    if (endringer.length === 0) {
        return null;
    }

    return (
        <>
            <button
                className={cn(styles.button, className)}
                type="button"
                ref={buttonRef}
                {...buttonProps}
                onClick={() => setVisEndringslogg(true)}
            >
                <Kilde type="Saksbehandler">
                    <PersonPencilFillIcon title="Saksbehandler ikon" />
                </Kilde>
            </button>
            {visEndringslogg && isArbeidsforholdoverstyringer(endringer) && (
                <EndringsloggArbeidsforhold
                    endringer={endringer}
                    closeModal={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            )}
            {visEndringslogg && isInntektoverstyringer(endringer) && (
                <EndringsloggInntekt
                    endringer={endringer}
                    closeModal={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            )}
            {visEndringslogg && isOverstyringerPrDag(endringer) && (
                <EndringsloggDager
                    endringer={endringer}
                    closeModal={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            )}
        </>
    );
};
