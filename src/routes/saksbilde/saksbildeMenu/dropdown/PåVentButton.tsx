import React, { ReactElement, useState } from 'react';

import { Dropdown, Loader } from '@navikt/ds-react';

import { LeggPåVentModal } from '@components/påvent/PåVentModaler';
import { PersonFragment, Personnavn } from '@io/graphql';
import { finnPeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useFjernPåVentFraSaksbilde } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';

interface PåVentButtonProps {
    person: PersonFragment;
}

export const PåVentButton = ({ person }: PåVentButtonProps): ReactElement | null => {
    const [showModal, setShowModal] = useState(false);
    const periodeTilGodkjenning = finnPeriodeTilGodkjenning(person);
    const [fjernPåVent, { loading, error: fjernPåVentError }] = useFjernPåVentFraSaksbilde(
        periodeTilGodkjenning?.behandlingId,
    );
    const errorHandler = useOperationErrorHandler('Legg på vent');
    const oppgaveId = periodeTilGodkjenning?.oppgave?.id;
    const erPåVent = periodeTilGodkjenning?.paVent;
    const tildeling = person.tildeling;

    if (!periodeTilGodkjenning || oppgaveId === undefined) return null;

    const navn: Personnavn = {
        __typename: 'Personnavn',
        fornavn: person.personinfo.fornavn,
        mellomnavn: person.personinfo.mellomnavn,
        etternavn: person.personinfo.etternavn,
    };

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
                <Dropdown.Menu.List.Item onClick={() => setShowModal(true)}>Legg på vent</Dropdown.Menu.List.Item>
            )}
            {showModal && (
                <LeggPåVentModal
                    oppgaveId={oppgaveId}
                    behandlingId={periodeTilGodkjenning.behandlingId}
                    navn={navn}
                    utgangspunktTildeling={tildeling}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};
