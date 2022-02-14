import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Loader } from '@navikt/ds-react';

import { LinkButton } from '@components/LinkButton';
import { putFeilregistrertNotat } from '@io/http';
import { useRefreshNotater } from '@state/notater';
import { useOperationErrorHandler } from '@state/varsler';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';
import { ignorePromise } from '@utils/promise';

const FeilregistrerButton = styled(LinkButton)`
    color: var(--navds-color-text-primary);
`;

const Row = styled.tr<{ error: boolean }>`
    ${(props) =>
        props.error &&
        css`
            > td {
                background-color: #f9d2cc !important;
            }

            > td:last-of-type {
                font-style: italic;
            }
        `}
`;

const Cell = styled.td`
    max-width: 22rem;
`;

interface NotatListeRadProps {
    notat: Notat;
    vedtaksperiodeId: string;
    innloggetSaksbehandler: Saksbehandler;
}

export const NotatListeRad = ({ notat, vedtaksperiodeId, innloggetSaksbehandler }: NotatListeRadProps) => {
    const [isFetching, setIsFetching] = useState(false);
    const refreshNotater = useRefreshNotater();
    const errorHandler = useOperationErrorHandler('Feilregistrering av Notat');

    const feilregistrerNotat = () => {
        setIsFetching(true);
        ignorePromise(
            putFeilregistrertNotat(vedtaksperiodeId, notat.id)
                .then(refreshNotater)
                .finally(() => setIsFetching(false)),
            errorHandler
        );
    };

    return (
        <Row error={notat.feilregistrert}>
            <Cell>{`${notat.opprettet.format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}`}</Cell>
            <Cell>{notat.saksbehandler.navn}</Cell>
            <Cell>{notat.tekst}</Cell>
            <Cell>
                {notat.feilregistrert
                    ? 'Feilregistrert'
                    : notat.saksbehandler.oid === innloggetSaksbehandler.oid && (
                          <FeilregistrerButton onClick={feilregistrerNotat}>
                              Feilregistrer {isFetching && <Loader size="xsmall" />}
                          </FeilregistrerButton>
                      )}
            </Cell>
        </Row>
    );
};
