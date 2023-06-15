import React, { Dispatch, SetStateAction } from 'react';

import { EditButton } from '@components/EditButton';
import { Arbeidsgiver, BeregnetPeriode } from '@io/graphql';
import { usePeriodForSkjæringstidspunktForArbeidsgiver } from '@state/arbeidsgiver';
import { isInCurrentGeneration } from '@state/selectors/period';

interface RedigerInntektProps {
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
    erRevurdering: boolean;
    skjæringstidspunkt: DateString;
    organisasjonsnummer: string;
    arbeidsgiver: Arbeidsgiver;
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
    ) as BeregnetPeriode;

    if (!isInCurrentGeneration(periode, arbeidsgiver)) return null;

    return (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText={erRevurdering ? 'Revurder' : 'Endre'}
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
        />
    );
};
