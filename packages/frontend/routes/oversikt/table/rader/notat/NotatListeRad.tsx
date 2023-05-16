import classNames from 'classnames';
import React, { useState } from 'react';

import { Loader } from '@navikt/ds-react';

import { LinkButton } from '@components/LinkButton';
import { putFeilregistrertNotat } from '@io/http';
import { useRefreshNotater } from '@state/notater';
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
    const [isFetching, setIsFetching] = useState(false);
    const refreshNotater = useRefreshNotater();
    const errorHandler = useOperationErrorHandler('Feilregistrering av notat');

    const feilregistrerNotat = () => {
        setIsFetching(true);
        ignorePromise(
            putFeilregistrertNotat(vedtaksperiodeId, notat.id)
                .then(refreshNotater)
                .finally(() => setIsFetching(false)),
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
                              Feilregistrer {isFetching && <Loader size="xsmall" />}
                          </LinkButton>
                      )}
            </td>
        </tr>
    );
};
