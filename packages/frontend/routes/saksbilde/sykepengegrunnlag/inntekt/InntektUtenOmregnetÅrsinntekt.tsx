import classNames from 'classnames';
import React from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
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
    if (!arbeidsgiver) return null;

    return (
        <ErrorBoundary fallback={<InntektError />}>
            <div className={classNames(styles.Inntektskilderinnhold, inntekt.deaktivert && styles.deaktivert)}>
                <div className={styles.Inntekt}>
                    <div className={styles.Header}>
                        <div className={styles.ArbeidsgiverHeader}>
                            <Arbeidsgivernavn
                                className={styles.Arbeidsgivernavn}
                                arbeidsgivernavn={arbeidsgiver.navn}
                            />
                            <div className={styles.Organisasjonsnummer}>
                                (
                                <Clipboard
                                    copyMessage="Organisasjonsnummer er kopiert"
                                    tooltip={{ content: 'Kopier organisasjonsnummer' }}
                                >
                                    <AnonymizableContainer>{arbeidsgiver.organisasjonsnummer}</AnonymizableContainer>
                                </Clipboard>
                                )
                            </div>
                            <Kilde type={Inntektskilde.Aordningen}>AO</Kilde>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};
