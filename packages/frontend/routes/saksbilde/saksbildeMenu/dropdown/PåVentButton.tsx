import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import { NotatType, Personinfo, Personnavn } from '@io/graphql';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useFjernPåVent, useLeggPåVent } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import { NyttNotatModal } from '../../../oversikt/table/cells/notat/NyttNotatModal';

interface PåVentButtonProps {
    personinfo: Personinfo;
}

export const PåVentButton = ({ personinfo }: PåVentButtonProps) => {
    const [visModal, setVisModal] = useState(false);

    const navigate = useNavigate();
    const [leggPåVentMedNotat, { error: leggPåVentError }] = useLeggPåVent();
    const [fjernPåVent, { loading, error: fjernPåVentError }] = useFjernPåVent();
    const errorHandler = useOperationErrorHandler('Legg på vent');
    const periodeTilGodkjenning = usePeriodeTilGodkjenning();
    const oppgaveId = periodeTilGodkjenning?.oppgave?.id;
    const erPåVent = periodeTilGodkjenning?.paVent;

    if (!periodeTilGodkjenning || oppgaveId === undefined) return null;

    const navn: Personnavn = {
        fornavn: personinfo.fornavn,
        mellomnavn: personinfo.mellomnavn,
        etternavn: personinfo.etternavn,
    };

    const settPåVent = async (notattekst: string, frist?: Maybe<string>, begrunnelse?: Maybe<string>) => {
        const fristVerdi = frist ? dayjs(frist, NORSK_DATOFORMAT).format(ISO_DATOFORMAT) : null;
        const begrunnelseVerdi = begrunnelse ?? null;

        await leggPåVentMedNotat(
            oppgaveId,
            fristVerdi,
            begrunnelseVerdi,
            notattekst,
            periodeTilGodkjenning.vedtaksperiodeId,
        );
        if (leggPåVentError) {
            errorHandler(leggPåVentError);
        }
        navigate('/');
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
                <NyttNotatModal
                    onClose={() => setVisModal(false)}
                    navn={navn}
                    vedtaksperiodeId={periodeTilGodkjenning.vedtaksperiodeId}
                    onSubmitOverride={settPåVent}
                    notattype={NotatType.PaaVent}
                />
            )}
        </>
    );
};
