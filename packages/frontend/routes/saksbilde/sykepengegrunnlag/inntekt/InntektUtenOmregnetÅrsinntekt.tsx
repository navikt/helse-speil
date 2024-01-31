import classNames from 'classnames';
import React from 'react';

import { Alert, BodyShort } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import { Arbeidsgiverinntekt, Inntektskilde } from '@io/graphql';
import { useArbeidsgiver } from '@state/arbeidsgiver';

import { Arbeidsgivernavn } from '../Arbeidsgivernavn';

import styles from './Inntekt.module.css';

const InntektError = () => {
    return (
        <Alert variant="error" size="small" className={styles.Inntekt}>
            Det har skjedd en feil. Kunne ikke vise inntekt for denne perioden.
        </Alert>
    );
};

interface InntektProps {
    inntekt: Arbeidsgiverinntekt;
}

export const InntektUtenOmregnetÅrsinntekt: React.FC<InntektProps> = ({ inntekt }) => {
    const arbeidsgiver = useArbeidsgiver(inntekt.arbeidsgiver);

    return (
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
                                (
                                <Clipboard
                                    copyMessage="Organisasjonsnummer er kopiert"
                                    tooltip={{ content: 'Kopier organisasjonsnummer' }}
                                >
                                    <AnonymizableContainer>
                                        {arbeidsgiver?.organisasjonsnummer ?? inntekt.arbeidsgiver}
                                    </AnonymizableContainer>
                                </Clipboard>
                                )
                            </div>
                            <Kilde type={Inntektskilde.Aordningen}>AO</Kilde>
                        </div>
                    </div>
                    {!arbeidsgiver && (
                        <Flex alignItems="center">
                            <BodyShort>For denne inntektskilden har vi ikke data som kan vises her</BodyShort>
                        </Flex>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
};
