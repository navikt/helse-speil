import React, { ReactElement, useRef, useState } from 'react';

import { CaseworkerFilled } from '@navikt/ds-icons';

import { Kilde } from '@components/Kilde';
import { EndringsloggArbeidsforhold } from '@components/endringslogg/EndringsloggArbeidsforhold';
import { EndringsloggDager } from '@components/endringslogg/EndringsloggDager';
import { EndringsloggInntekt } from '@components/endringslogg/EndringsloggInntekt';
import { Kildetype, Maybe, OverstyringFragment } from '@io/graphql';
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
                <Kilde type={Kildetype.Saksbehandler}>
                    <CaseworkerFilled title="Caseworker-ikon" height={20} width={20} />
                </Kilde>
            </button>
            {isArbeidsforholdoverstyringer(endringer) ? (
                <EndringsloggArbeidsforhold
                    endringer={endringer}
                    onClose={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            ) : isInntektoverstyringer(endringer) ? (
                <EndringsloggInntekt
                    endringer={endringer}
                    onClose={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            ) : isOverstyringerPrDag(endringer) ? (
                <EndringsloggDager
                    endringer={endringer}
                    onClose={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            ) : null}
        </>
    );
};
