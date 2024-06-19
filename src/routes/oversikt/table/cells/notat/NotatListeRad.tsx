import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { Loader, Table } from '@navikt/ds-react';

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

export const NotatListeRad = ({ notat, innloggetSaksbehandler }: NotatListeRadProps): ReactElement => {
    const errorHandler = useOperationErrorHandler('Feilregistrering av notat');
    const [feilregistrerNotat, { loading }] = useMutation(FeilregistrerNotatMutationDocument, {
        variables: { id: parseInt(notat.id) },
        onError: errorHandler,
    });

    return (
        <Table.Row className={classNames(styles.NotatListeRad, notat.feilregistrert && styles.error)}>
            <Table.DataCell>{`${notat.opprettet.format(NORSK_DATOFORMAT_MED_KLOKKESLETT)}`}</Table.DataCell>
            <Table.DataCell>{notat.saksbehandler.ident}</Table.DataCell>
            <Table.DataCell className={styles.Kommentar}>{notat.tekst}</Table.DataCell>
            <Table.DataCell>
                {notat.feilregistrert
                    ? 'Feilregistrert'
                    : notat.saksbehandler.oid === innloggetSaksbehandler.oid && (
                          <LinkButton className={styles.FeilregistrerButton} onClick={() => feilregistrerNotat()}>
                              Feilregistrer {loading && <Loader size="xsmall" />}
                          </LinkButton>
                      )}
            </Table.DataCell>
        </Table.Row>
    );
};
