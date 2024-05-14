import React, { useState } from 'react';

import { Loader } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import { Personinfo, Personnavn } from '@io/graphql';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useCurrentPerson } from '@state/person';
import { useFjernPåVent } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';

import { PåVentNotatModal } from '../../../oversikt/table/cells/notat/PåVentNotatModal';

interface PåVentButtonProps {
    personinfo: Personinfo;
}

export const PåVentButton = ({ personinfo }: PåVentButtonProps) => {
    const [visModal, setVisModal] = useState(false);

    const [fjernPåVent, { loading, error: fjernPåVentError }] = useFjernPåVent();
    const errorHandler = useOperationErrorHandler('Legg på vent');
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
    const oppgaveId = periodeTilGodkjenning?.oppgave?.id;
    const erPåVent = periodeTilGodkjenning?.paVent;
    const tildeling = useCurrentPerson()?.tildeling ?? null;

    console.log('fjernPåVent loading: ', loading);

    if (!periodeTilGodkjenning || oppgaveId === undefined) return null;

    const navn: Personnavn = {
        fornavn: personinfo.fornavn,
        mellomnavn: personinfo.mellomnavn,
        etternavn: personinfo.etternavn,
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
                <Dropdown.Menu.List.Item onClick={() => setVisModal(true)}>Legg på vent</Dropdown.Menu.List.Item>
            )}
            {visModal && (
                <PåVentNotatModal
                    onClose={() => setVisModal(false)}
                    navn={navn}
                    vedtaksperiodeId={periodeTilGodkjenning.vedtaksperiodeId}
                    oppgaveId={oppgaveId}
                    tildeling={tildeling}
                />
            )}
        </>
    );
};
