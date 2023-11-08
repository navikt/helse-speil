import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import { NotatType, Personinfo, Personnavn } from '@io/graphql';
import { useFjernPåVent, useLeggPåVent } from '@state/tildeling';
import { useOperationErrorHandler } from '@state/varsler';

import { NyttNotatModal } from '../../../oversikt/table/cells/notat/NyttNotatModal';

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
    const [visModal, setVisModal] = useState(false);

    const navigate = useNavigate();
    const [leggPåVentMedNotat, { error: leggPåVentError }] = useLeggPåVent();
    const [fjernPåVent, { loading, error: fjernPåVentError }] = useFjernPåVent();
    const errorHandler = useOperationErrorHandler('Legg på vent');

    const navn: Personnavn = {
        fornavn: personinfo.fornavn,
        mellomnavn: personinfo.mellomnavn,
        etternavn: personinfo.etternavn,
    };

    const settPåVent = async (notattekst: string) => {
        await leggPåVentMedNotat(oppgavereferanse, notattekst, vedtaksperiodeId);
        if (leggPåVentError) {
            errorHandler(leggPåVentError);
        }
        navigate('/');
    };

    const fjernFraPåVent = async () => {
        await fjernPåVent(oppgavereferanse);
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
                <NyttNotatModal
                    onClose={() => setVisModal(false)}
                    navn={navn}
                    vedtaksperiodeId={vedtaksperiodeId}
                    onSubmitOverride={settPåVent}
                    notattype={NotatType.PaaVent}
                />
            )}
        </>
    );
};
