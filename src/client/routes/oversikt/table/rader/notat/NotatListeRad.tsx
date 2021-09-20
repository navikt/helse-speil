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

const Row = styled.tr`
    position: relative;

    &:nth-of-type(2n + 1) {
        background-color: var(--speil-table-row-background-color-alternate);
    }
`;

const AlertRow = styled.tr`
    position: relative;
    background-color: #f9d2cc;
`;

const Cell = styled.td`
    position: relative;
    border-bottom: 1px solid var(--speil-table-row-border-color);
    height: 2rem;
    vertical-align: middle;
`;

const TextCell = styled.td`
    position: relative;
    border-bottom: 1px solid var(--speil-table-row-border-color);
    height: 2rem;
    vertical-align: middle;
    max-width: 200px;
    word-break: break-word;
`;

const LenkeCell = styled(Link)`
    color: var(--navds-color-text-primary);
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
            <Cell>{`${notat.opprettet.format(NORSK_DATOFORMAT)} kl ${notat.opprettet.format(NORSK_KLOKKESLETT)}`}</Cell>
            <Cell>{notat.saksbehandler.navn}</Cell>
            <TextCell>{notat.tekst}</TextCell>
        </>
    );

    return notat.feilregistrert ? (
        <AlertRow>
            {fellesRader}
            <TextCell>Feilregistrert</TextCell>
        </AlertRow>
    ) : (
        <Row>
            {fellesRader}
            <TextCell>
                {notat.saksbehandler.oid === saksbehandler.oid && (
                    <LenkeCell href="#" onClick={() => prøvFeilregistrerNotat(notat.id)}>
                        Feilregistrer {isFetching && <Loader size="xs" />}
                    </LenkeCell>
                )}
            </TextCell>
        </Row>
    );
};
