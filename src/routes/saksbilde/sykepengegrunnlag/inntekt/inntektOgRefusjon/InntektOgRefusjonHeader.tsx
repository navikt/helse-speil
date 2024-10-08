import classNames from 'classnames';
import React from 'react';

import { Kilde } from '@components/Kilde';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import { Arbeidsgivernavn } from '@saksbilde/sykepengegrunnlag/Arbeidsgivernavn';
import styles from '@saksbilde/sykepengegrunnlag/inntekt/Inntekt.module.css';

interface InntektOgRefusjonHeaderProps {
    editing: boolean;
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
}

export const InntektOgRefusjonHeader = ({
    editing,
    arbeidsgivernavn,
    organisasjonsnummer,
}: InntektOgRefusjonHeaderProps) => (
    <div className={classNames(styles.Header, editing && styles.editing)}>
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
    </div>
);
