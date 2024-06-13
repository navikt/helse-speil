import classNames from 'classnames';
import React from 'react';

import { Loader } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { LinkButton } from '@components/LinkButton';
import { FeilregistrerNotatMutationDocument } from '@io/graphql';
import { Saksbehandler } from '@state/authentication';
import { useOperationErrorHandler } from '@state/varsler';
import { Notat } from '@typer/notat';
import { NORSK_DATOFORMAT_MED_KLOKKESLETT } from '@utils/date';

import styles from './NotatListeRad.module.css';

interface NotatListeRadProps {
    notat: Notat;
    innloggetSaksbehandler: Saksbehandler;
}

export const NotatListeRad = ({ notat, innloggetSaksbehandler }: NotatListeRadProps) => {
    const errorHandler = useOperationErrorHandler('Feilregistrering av notat');
    const [feilregistrerNotat, { loading }] = useMutation(FeilregistrerNotatMutationDocument, {
        variables: { id: parseInt(notat.id) },
        onError: errorHandler,
    });

    return (
        <tr className={classNames(styles.NotatListeRad, notat.feilregistrert && styles.error)}>
            <td>{`${notat.opprettet.format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}`}</td>
            <td>{notat.saksbehandler.ident}</td>
            <td className={styles.Kommentar}>{notat.tekst}</td>
            <td>
                {notat.feilregistrert
                    ? 'Feilregistrert'
                    : notat.saksbehandler.oid === innloggetSaksbehandler.oid && (
                          <LinkButton className={styles.FeilregistrerButton} onClick={() => feilregistrerNotat()}>
                              Feilregistrer {loading && <Loader size="xsmall" />}
                          </LinkButton>
                      )}
            </td>
        </tr>
    );
};
