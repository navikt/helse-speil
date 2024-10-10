import React from 'react';

import { HStack } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import { Arbeidsgivernavn } from '@saksbilde/sykepengegrunnlag/Arbeidsgivernavn';
import styles from '@saksbilde/sykepengegrunnlag/inntekt/Inntekt.module.css';

interface InntektOgRefusjonHeaderProps {
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
}

export const InntektOgRefusjonHeader = ({ arbeidsgivernavn, organisasjonsnummer }: InntektOgRefusjonHeaderProps) => (
    <HStack marginBlock="0 6" justify="space-between">
        <div className={styles.ArbeidsgiverHeader}>
            <Arbeidsgivernavn className={styles.Arbeidsgivernavn} arbeidsgivernavn={arbeidsgivernavn} />
            <div className={styles.Organisasjonsnummer}>
                (
                <Clipboard
                    copyMessage="Organisasjonsnummer er kopiert"
                    tooltip={{ content: 'Kopier organisasjonsnummer' }}
                >
                    <AnonymizableContainer>{organisasjonsnummer}</AnonymizableContainer>
                </Clipboard>
                )
            </div>
            <Kilde type="AINNTEKT">AA</Kilde>
        </div>
    </HStack>
);
