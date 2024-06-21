import React, { ReactElement, useState } from 'react';

import { Dropdown, Loader } from '@navikt/ds-react';

import { Maybe, PersonFragment, Personnavn } from '@io/graphql';
import { PåVentNotatModal } from '@oversikt/table/cells/notat/PåVentNotatModal';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useFjernPåVent } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';

interface PåVentButtonProps {
    person: PersonFragment;
}

export const PåVentButton = ({ person }: PåVentButtonProps): Maybe<ReactElement> => {
    const [showModal, setShowModal] = useState(false);

    const [fjernPåVent, { loading, error: fjernPåVentError }] = useFjernPåVent();
    const errorHandler = useOperationErrorHandler('Legg på vent');
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
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
                <PåVentNotatModal
                    onClose={() => setShowModal(false)}
                    showModal={showModal}
                    navn={navn}
                    vedtaksperiodeId={periodeTilGodkjenning.vedtaksperiodeId}
                    oppgaveId={oppgaveId}
                    tildeling={tildeling}
                />
            )}
        </>
    );
};
