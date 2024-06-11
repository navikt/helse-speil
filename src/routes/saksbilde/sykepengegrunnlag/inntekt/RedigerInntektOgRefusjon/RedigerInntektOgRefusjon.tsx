import styles from './RedigerInntektOgRefusjon.module.scss';
import React, { Dispatch, SetStateAction } from 'react';

import { DateString } from '@/types/shared';
import { EditButton } from '@components/EditButton';
import { ArbeidsgiverFragment, BeregnetPeriodeFragment } from '@io/graphql';
import { usePeriodForSkjæringstidspunktForArbeidsgiver } from '@state/arbeidsgiver';
import { isInCurrentGeneration } from '@state/selectors/period';

interface RedigerInntektProps {
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
    erRevurdering: boolean;
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
    arbeidsgiver: ArbeidsgiverFragment;
}

export const RedigerInntektOgRefusjon = ({
    setEditing,
    editing,
    erRevurdering,
    skjæringstidspunkt,
    organisasjonsnummer,
    arbeidsgiver,
}: RedigerInntektProps) => {
    const periode = usePeriodForSkjæringstidspunktForArbeidsgiver(
        skjæringstidspunkt,
        organisasjonsnummer,
    ) as BeregnetPeriodeFragment;

    if (!isInCurrentGeneration(periode, arbeidsgiver)) return null;

    return (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText={erRevurdering ? 'Revurder' : 'Endre'}
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
            className={styles.button}
        />
    );
};
