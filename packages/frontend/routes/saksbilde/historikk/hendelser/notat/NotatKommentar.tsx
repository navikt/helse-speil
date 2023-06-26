import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { ErrorMessage } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { FeilregistrerKommentarMutationDocument, Kommentar } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useRefetchPerson } from '@state/person';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

import { HendelseDate } from '../HendelseDate';
import { HendelseDropdownMenu } from './HendelseDropdownMenu';

import styles from './Kommentarer.module.css';

interface NotatKommentarProps {
    kommentar: Kommentar;
    forfatterSaksbehandlerOid: string;
}

export const NotatKommentar = ({ kommentar, forfatterSaksbehandlerOid }: NotatKommentarProps) => {
    const [feilregistrerKommentar, { loading, error }] = useMutation(FeilregistrerKommentarMutationDocument);
    const refetchPerson = useRefetchPerson();
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const onFeilregistrerKommentar = (id: number) => () => {
        feilregistrerKommentar({ variables: { id: id } }).then(() => {
            refetchPerson();
        });
    };

    const erFeilregistrert = dayjs(kommentar.feilregistrert_tidspunkt, ISO_TIDSPUNKTFORMAT).isValid();

    return (
        <div key={kommentar.id} className={styles.Kommentar}>
            <pre className={classNames({ [styles.Feilregistrert]: erFeilregistrert })}>
                {kommentar.tekst} {erFeilregistrert && '(feilregistert)'}
            </pre>
            {!kommentar.feilregistrert_tidspunkt && innloggetSaksbehandler.oid === forfatterSaksbehandlerOid && (
                <HendelseDropdownMenu
                    feilregistrerAction={onFeilregistrerKommentar(kommentar.id)}
                    isFetching={loading}
                />
            )}
            {error && <ErrorMessage>Kunne ikke feilregistrere kommentar. Prøv igjen senere.</ErrorMessage>}
            <HendelseDate timestamp={kommentar.opprettet} ident={kommentar.saksbehandlerident} />
        </div>
    );
};
