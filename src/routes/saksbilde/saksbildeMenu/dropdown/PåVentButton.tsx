import React, { ReactElement } from 'react';

import { Dropdown, Loader } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import { finnPeriodeTilGodkjenning } from '@state/inntektsforhold/inntektsforhold';
import { useFjernPåVentFraSaksbilde } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';

interface PåVentButtonProps {
    person: PersonFragment;
    showModal: () => void;
}

export const PåVentButton = ({ person, showModal }: PåVentButtonProps): ReactElement | null => {
    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    const [fjernPåVent, { loading, error: fjernPåVentError }] = useFjernPåVentFraSaksbilde(
        periodeTilGodkjenning?.behandlingId,
    );
    const errorHandler = useOperationErrorHandler('Legg på vent');
    const oppgaveId = periodeTilGodkjenning?.oppgave?.id;
    const erPåVent = periodeTilGodkjenning?.paVent;

    if (!periodeTilGodkjenning || oppgaveId === undefined) return null;

    const fjernFraPåVent = async () => {
        await fjernPåVent(oppgaveId);
        if (fjernPåVentError) {
            errorHandler(fjernPåVentError);
        }
    };

    return (
        <>
            {erPåVent ? (
                <Dropdown.Menu.List.Item onClick={fjernFraPåVent}>
                    Fjern fra på vent
                    {loading && <Loader size="xsmall" />}
                </Dropdown.Menu.List.Item>
            ) : (
                <Dropdown.Menu.List.Item onClick={showModal}>Legg på vent</Dropdown.Menu.List.Item>
            )}
        </>
    );
};
