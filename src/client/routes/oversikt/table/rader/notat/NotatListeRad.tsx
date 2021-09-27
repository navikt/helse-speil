import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';

import { Link, Loader } from '@navikt/ds-react';

import { putFeilregistrertNotat } from '../../../../../io/http';
import { notaterStateRefetchKey } from '../../../../../state/notater';
import { useOperationErrorHandler } from '../../../../../state/varsler';
import { NORSK_DATOFORMAT, NORSK_KLOKKESLETT } from '../../../../../utils/date';
import { ignorePromise } from '../../../../../utils/promise';

import { sleep } from '../../../../../../server/devHelpers';

const LenkeCell = styled(Link)`
    color: var(--navds-color-text-primary);
    cursor: pointer;
`;

const KursivCell = styled.td`
    font-style: italic;
`;

interface Props {
    notat: Notat;
    vedtaksperiodeId: string;
    saksbehandler: Saksbehandler;
}

export const NotatListeRad = ({ notat, vedtaksperiodeId, saksbehandler }: Props) => {
    const [isFetching, setIsFetching] = useState(false);
    const refreshNotater = useSetRecoilState(notaterStateRefetchKey);
    const errorHandler = useOperationErrorHandler('Feilregistrering av Notat');

    const prøvFeilregistrerNotat = (notatId: string) => {
        setIsFetching(true);
        ignorePromise(
            sleep(500)
                .then(() => putFeilregistrertNotat(vedtaksperiodeId, notatId))
                .then(() => {
                    refreshNotater(new Date());
                })
                .finally(() => {
                    setIsFetching(true);
                }),
            errorHandler
        );
    };

    const fellesRader = (
        <>
            <td>{`${notat.opprettet.format(NORSK_DATOFORMAT)} kl ${notat.opprettet.format(NORSK_KLOKKESLETT)}`}</td>
            <td>{notat.saksbehandler.navn}</td>
            <td>{notat.tekst}</td>
        </>
    );

    return notat.feilregistrert ? (
        <tr className="alert">
            {fellesRader}
            <KursivCell>Feilregistrert</KursivCell>
        </tr>
    ) : (
        <tr>
            {fellesRader}
            <td>
                {notat.saksbehandler.oid === saksbehandler.oid && (
                    <LenkeCell as="a" onClick={() => prøvFeilregistrerNotat(notat.id)}>
                        Feilregistrer {isFetching && <Loader size="xsmall" />}
                    </LenkeCell>
                )}
            </td>
        </tr>
    );
};
