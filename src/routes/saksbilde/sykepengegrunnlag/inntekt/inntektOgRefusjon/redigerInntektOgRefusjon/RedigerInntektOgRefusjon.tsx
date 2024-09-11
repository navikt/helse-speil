import React, { Dispatch, SetStateAction } from 'react';

import { EditButton } from '@components/EditButton';
import { ArbeidsgiverFragment, BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { usePeriodForSkjæringstidspunktForArbeidsgiver } from '@state/arbeidsgiver';
import { isInCurrentGeneration } from '@state/selectors/period';
import { DateString } from '@typer/shared';

import styles from './RedigerInntektOgRefusjon.module.scss';

interface RedigerInntektProps {
    person: PersonFragment;
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
    erRevurdering: boolean;
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
    arbeidsgiver: ArbeidsgiverFragment;
}

export const RedigerInntektOgRefusjon = ({
    person,
    setEditing,
    editing,
    erRevurdering,
    skjæringstidspunkt,
    organisasjonsnummer,
    arbeidsgiver,
}: RedigerInntektProps) => {
    const periode = usePeriodForSkjæringstidspunktForArbeidsgiver(
        person,
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
            className={styles.sticky}
        />
    );
};
