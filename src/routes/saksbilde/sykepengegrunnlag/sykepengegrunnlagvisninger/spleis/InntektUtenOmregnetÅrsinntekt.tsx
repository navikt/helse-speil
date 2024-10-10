import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Alert, BodyShort, CopyButton, Tooltip } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Kilde } from '@components/Kilde';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { ArbeidsgiverFragment, Arbeidsgiverinntekt, Inntektskilde, Maybe } from '@io/graphql';

import { Arbeidsgivernavn } from '../../Arbeidsgivernavn';

import styles from '../../inntekt/Inntekt.module.css';

const InntektError = (): ReactElement => {
    return (
        <Alert variant="error" size="small" className={styles.Inntekt}>
            Det har skjedd en feil. Kunne ikke vise inntekt for denne perioden.
        </Alert>
    );
};

interface InntektProps {
    arbeidsgiver: Maybe<ArbeidsgiverFragment>;
    inntekt: Arbeidsgiverinntekt;
}

export const InntektUtenOmregnetÅrsinntekt = ({ arbeidsgiver, inntekt }: InntektProps): ReactElement => (
    <ErrorBoundary fallback={<InntektError />}>
        <div className={classNames(styles.Inntektskilderinnhold, inntekt.deaktivert && styles.deaktivert)}>
            <div className={styles.Inntekt}>
                <div className={styles.Header}>
                    <div className={styles.ArbeidsgiverHeader}>
                        <Arbeidsgivernavn
                            className={styles.Arbeidsgivernavn}
                            arbeidsgivernavn={arbeidsgiver?.navn ?? 'Ukjent'}
                        />
                        <div className={styles.Organisasjonsnummer}>
                            <Tooltip content={'Kopier organisasjonsnummer'}>
                                <CopyButton copyText={arbeidsgiver?.organisasjonsnummer ?? inntekt.arbeidsgiver} />
                            </Tooltip>
                            <AnonymizableContainer>
                                {arbeidsgiver?.organisasjonsnummer ?? inntekt.arbeidsgiver}
                            </AnonymizableContainer>
                        </div>
                        <Kilde type={Inntektskilde.Aordningen}>AO</Kilde>
                    </div>
                </div>
                {!arbeidsgiver && (
                    <div className={styles.aligncenter}>
                        <BodyShort>Vi har ikke data for denne inntektskilden</BodyShort>
                    </div>
                )}
            </div>
        </div>
    </ErrorBoundary>
);
