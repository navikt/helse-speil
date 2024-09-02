import classNames from 'classnames';
import React from 'react';

import { EditButton } from '@components/EditButton';
import { Kilde } from '@components/Kilde';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { Clipboard } from '@components/clipboard';
import { ArbeidsgiverFragment, GhostPeriodeFragment, Kildetype, Maybe, PersonFragment } from '@io/graphql';
import { Arbeidsgivernavn } from '@saksbilde/sykepengegrunnlag/Arbeidsgivernavn';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';

import styles from './TilkommenInntekt.module.scss';

interface TilkommenInntektHeaderProps {
    person: PersonFragment;
    arbeidsgiver: Maybe<ArbeidsgiverFragment>;
    periode: GhostPeriodeFragment;
    editing: boolean;
    setEditing: (state: boolean) => void;
}

export const TilkommenInntektHeader = ({
    person,
    arbeidsgiver,
    periode,
    editing,
    setEditing,
}: TilkommenInntektHeaderProps) => {
    const harBeslutteroppgave = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

    return (
        <div className={classNames(styles.header, { [styles.editing]: editing })}>
            <div className={styles.arbeidsgiverHeader}>
                <Arbeidsgivernavn className={styles.arbeidsgivernavn} arbeidsgivernavn={arbeidsgiver?.navn} />
                <div className={styles.organisasjonsnummer}>
                    (
                    <Clipboard
                        copyMessage="Organisasjonsnummer er kopiert"
                        tooltip={{ content: 'Kopier organisasjonsnummer' }}
                    >
                        <AnonymizableContainer>{arbeidsgiver?.organisasjonsnummer}</AnonymizableContainer>
                    </Clipboard>
                    )
                </div>
                <Kilde type={Kildetype.Soknad}>SØ</Kilde>
            </div>
            {!harBeslutteroppgave && (
                <EditButton
                    isOpen={editing}
                    openText="Avbryt"
                    closedText="Endre"
                    onOpen={() => setEditing(true)}
                    onClose={() => setEditing(false)}
                    className={styles.redigeringsknapp}
                />
            )}
        </div>
    );
};
