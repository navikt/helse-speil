import React, { ReactElement } from 'react';

import { ActionMenu, Loader } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import { useDeletePåVent } from '@io/rest/generated/oppgaver/oppgaver';
import { finnPeriodeTilGodkjenning } from '@state/inntektsforhold/inntektsforhold';
import { useFetchPersonQuery } from '@state/person';
import { useOperationErrorHandler } from '@state/varsler';

interface PåVentButtonProps {
    person: PersonFragment;
    showModal: () => void;
}

export const PåVentButton = ({ person, showModal }: PåVentButtonProps): ReactElement | null => {
    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    const { mutate: fjernPåVent, isPending: loading } = useDeletePåVent();
    const { refetch } = useFetchPersonQuery();
    const errorHandler = useOperationErrorHandler('Legg på vent');
    const oppgaveId = periodeTilGodkjenning?.oppgave?.id;
    const erPåVent = periodeTilGodkjenning?.paVent;

    if (!periodeTilGodkjenning || oppgaveId === undefined) return null;

    const fjernFraPåVent = async () =>
        fjernPåVent(
            {
                oppgaveId: Number.parseInt(oppgaveId),
            },
            {
                onSuccess: async () => refetch(),
                onError: (error) => errorHandler(new Error(error.message)),
            },
        );

    return (
        <>
            {erPåVent ? (
                <ActionMenu.Item onSelect={fjernFraPåVent} className="text-ax-large">
                    Fjern fra på vent
                    {loading && <Loader size="xsmall" />}
                </ActionMenu.Item>
            ) : (
                <ActionMenu.Item onSelect={showModal} className="text-ax-large">
                    Legg på vent
                </ActionMenu.Item>
            )}
        </>
    );
};
