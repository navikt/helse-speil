import classNames from 'classnames';
import React, { PropsWithChildren, ReactElement, useRef, useState } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';

import { ErrorBoundary } from './ErrorBoundary';
import { Clipboard } from './clipboard';

import styles from './AgurkErrorBoundary.module.css';

interface ErrorInnholdProps {
    errormelding?: string;
    sidenavn?: string;
}

const ErrorInnhold = ({ sidenavn, errormelding }: ErrorInnholdProps): ReactElement => {
    const ref = useRef<HTMLParagraphElement>(null);
    return (
        <div className={styles.container}>
            <BodyShort as="p" className={styles.agurktekst}>
                Det har dessverre oppstått en feil, og for denne perioden kan ikke {sidenavn ?? 'siden'} vises.
            </BodyShort>
            <div>
                <span className={styles.utviklermelding}>
                    Feilmelding til utviklere (<Clipboard copySource={ref}>trykk på ikonet for å kopiere:</Clipboard>
                    ):
                </span>
                <p className={classNames(styles.feilmelding, 'typo-undertekst')} ref={ref}>
                    {errormelding}
                </p>
            </div>
        </div>
    );
};

interface AgurkErrorBoundaryProps {
    sidenavn?: string;
}

export const AgurkErrorBoundary = ({
    children,
    sidenavn,
}: PropsWithChildren<AgurkErrorBoundaryProps>): Maybe<ReactElement> => {
    const [errormelding, setErrormelding] = useState<string | undefined>();
    if (!children) return null;
    return (
        <ErrorBoundary
            fallback={<ErrorInnhold errormelding={errormelding} sidenavn={sidenavn} />}
            onError={(error: Error) => setErrormelding(error.stack)}
        >
            {children}
        </ErrorBoundary>
    );
};
