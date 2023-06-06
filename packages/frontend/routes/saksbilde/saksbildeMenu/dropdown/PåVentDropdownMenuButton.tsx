import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Loader } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import { Personinfo, Personnavn } from '@io/graphql';
import { useFjernPåVent, useLeggPåVent } from '@state/person';
import { useOperationErrorHandler } from '@state/varsler';
import { ignorePromise } from '@utils/promise';

import { NyttNotatModal } from '../../../oversikt/table/rader/notat/NyttNotatModal';

interface PåVentDropdownMenuButtonProps {
    oppgavereferanse: string;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    erPåVent?: boolean;
}

export const PåVentDropdownMenuButton = ({
    erPåVent,
    oppgavereferanse,
    vedtaksperiodeId,
    personinfo,
}: PåVentDropdownMenuButtonProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const [visModal, setVisModal] = useState(false);

    const history = useHistory();
    const leggPåVentMedNotat = useLeggPåVent();
    const fjernPåVent = useFjernPåVent();
    const errorHandler = useOperationErrorHandler('Legg på vent');

    const navn: Personnavn = {
        fornavn: personinfo.fornavn,
        mellomnavn: personinfo.mellomnavn,
        etternavn: personinfo.etternavn,
    };

    const settPåVent = (notattekst: string) => {
        setIsFetching(true);
        return leggPåVentMedNotat(oppgavereferanse, { tekst: notattekst, type: 'PaaVent' })
            .then(() => history.push('/'))
            .catch(errorHandler);
    };

    const fjernFraPåVent = () => {
        setIsFetching(true);
        ignorePromise(
            fjernPåVent(oppgavereferanse).finally(() => {
                setIsFetching(false);
            }),
            errorHandler,
        );
    };

    return (
        <>
            {erPåVent ? (
                <Dropdown.Menu.List.Item onClick={fjernFraPåVent}>
                    Fjern fra på vent
                    {isFetching && <Loader size="xsmall" />}
                </Dropdown.Menu.List.Item>
            ) : (
                <Dropdown.Menu.List.Item onClick={() => setVisModal(true)}>Legg på vent</Dropdown.Menu.List.Item>
            )}
            {visModal && (
                <NyttNotatModal
                    onClose={() => setVisModal(false)}
                    navn={navn}
                    vedtaksperiodeId={vedtaksperiodeId}
                    onSubmitOverride={settPåVent}
                    notattype="PaaVent"
                />
            )}
        </>
    );
};
