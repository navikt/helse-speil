import classNames from 'classnames';
import React from 'react';

import { Loader } from '@navikt/ds-react';

import { useLazyQuery } from '@apollo/client';
import { LinkButton } from '@components/LinkButton';
import { FetchNotaterDocument } from '@io/graphql';
import { putFeilregistrertNotat } from '@io/http';
import { useOperationErrorHandler } from '@state/varsler';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';
import { ignorePromise } from '@utils/promise';

import styles from './NotatListeRad.module.css';

interface NotatListeRadProps {
    notat: Notat;
    vedtaksperiodeId: string;
    innloggetSaksbehandler: Saksbehandler;
}

export const NotatListeRad = ({ notat, vedtaksperiodeId, innloggetSaksbehandler }: NotatListeRadProps) => {
    const [refreshNotater, { loading }] = useLazyQuery(FetchNotaterDocument, {
        initialFetchPolicy: 'network-only',
        variables: { forPerioder: [vedtaksperiodeId] },
    });
    const errorHandler = useOperationErrorHandler('Feilregistrering av notat');

    const feilregistrerNotat = () => {
        ignorePromise(
            putFeilregistrertNotat(vedtaksperiodeId, notat.id).then(() => refreshNotater()),
            errorHandler,
        );
    };

    return (
        <tr className={classNames(styles.NotatListeRad, notat.feilregistrert && styles.error)}>
            <td>{`${notat.opprettet.format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}`}</td>
            <td>{notat.saksbehandler.ident}</td>
            <td>{notat.tekst}</td>
            <td>
                {notat.feilregistrert
                    ? 'Feilregistrert'
                    : notat.saksbehandler.oid === innloggetSaksbehandler.oid && (
                          <LinkButton className={styles.FeilregistrerButton} onClick={feilregistrerNotat}>
                              Feilregistrer {loading && <Loader size="xsmall" />}
                          </LinkButton>
                      )}
            </td>
        </tr>
    );
};
