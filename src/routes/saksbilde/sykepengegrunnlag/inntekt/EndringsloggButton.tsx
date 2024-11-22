import React, { ReactElement, useRef, useState } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { EndringsloggArbeidsforhold } from '@components/endringslogg/EndringsloggArbeidsforhold';
import { EndringsloggDager } from '@components/endringslogg/EndringsloggDager';
import { EndringsloggInntekt } from '@components/endringslogg/EndringsloggInntekt';
import { Maybe, OverstyringFragment } from '@io/graphql';
import { isArbeidsforholdoverstyringer, isInntektoverstyringer, isOverstyringerPrDag } from '@utils/typeguards';

import styles from './EndringsloggButton.module.css';

interface EndringsloggButtonProps<T extends OverstyringFragment> extends React.HTMLAttributes<HTMLButtonElement> {
    endringer: Array<T>;
}

export const EndringsloggButton = <T extends OverstyringFragment>({
    endringer,
    ...buttonProps
}: EndringsloggButtonProps<T>): Maybe<ReactElement> => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

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
                <Kilde type={'Saksbehandler'}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" />
                </Kilde>
            </button>
            {visEndringslogg && isArbeidsforholdoverstyringer(endringer) && (
                <EndringsloggArbeidsforhold
                    endringer={endringer}
                    onClose={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            )}
            {visEndringslogg && isInntektoverstyringer(endringer) && (
                <EndringsloggInntekt
                    endringer={endringer}
                    onClose={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            )}
            {visEndringslogg && isOverstyringerPrDag(endringer) && (
                <EndringsloggDager
                    endringer={endringer}
                    onClose={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            )}
        </>
    );
};
