import React from 'react';

import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { EditButton } from '@components/EditButton';
import { Kilde } from '@components/Kilde';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import {
    ArbeidsgiverFragment,
    Kildetype,
    Maybe,
    NyttInntektsforholdPeriodeFragment,
    PersonFragment,
} from '@io/graphql';
import { Arbeidsgivernavn } from '@saksbilde/sykepengegrunnlag/Arbeidsgivernavn';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';

import styles from './TilkommenAG.module.scss';

interface TilkommenAGHeaderProps {
    person: PersonFragment;
    arbeidsgiver: Maybe<ArbeidsgiverFragment>;
    periode: NyttInntektsforholdPeriodeFragment;
    editing: boolean;
    setEditing: (state: boolean) => void;
}

export const TilkommenAGHeader = ({ person, arbeidsgiver, periode, editing, setEditing }: TilkommenAGHeaderProps) => {
    const harBeslutteroppgave = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

    if (arbeidsgiver == null) return null;

    return (
        <HStack justify="space-between" marginBlock="0 4">
            <HStack gap="2" align="center">
                <Arbeidsgivernavn className={styles.arbeidsgivernavn} arbeidsgivernavn={arbeidsgiver?.navn} />
                <HStack align="center">
                    <BodyShort weight="semibold" size="large">
                        (
                    </BodyShort>
                    <AnonymizableText weight="semibold">{arbeidsgiver?.organisasjonsnummer}</AnonymizableText>
                    <Tooltip content="Kopier organiasasjonsnummer">
                        <CopyButton copyText={arbeidsgiver?.organisasjonsnummer} size="small" />
                    </Tooltip>
                    <BodyShort weight="semibold" size="large">
                        )
                    </BodyShort>
                </HStack>
                <Kilde type={Kildetype.Soknad}>SØ</Kilde>
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
            </HStack>
        </HStack>
    );
};
