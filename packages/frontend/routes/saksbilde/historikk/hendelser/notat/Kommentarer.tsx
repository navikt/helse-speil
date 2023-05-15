import classNames from 'classnames';
import React, { useState } from 'react';

import { BodyShort, ErrorMessage } from '@navikt/ds-react';

import { Kommentar } from '@io/graphql';
import { feilregistrerKommentar } from '@io/graphql/feilregistrerKommentar';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useRefreshNotater } from '@state/notater';
import { useRefetchPerson } from '@state/person';

import { HendelseDate } from '../HendelseDate';
import { HendelseDropdownMenu } from './HendelseDropdownMenu';

import styles from './Kommentarer.module.css';

interface KommentarerProps {
    kommentarer: Array<Kommentar>;
    saksbehandlerOid: string;
}

export const Kommentarer: React.FC<KommentarerProps> = ({ kommentarer, saksbehandlerOid }) => {
    const [isFetching, setIsFetching] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    const refreshNotater = useRefreshNotater();
    const refetchPerson = useRefetchPerson();
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const onFeilregistrerKommentar = (id: number) => () => {
        setIsFetching(true);
        setErrors((prevState) => ({ ...prevState, [id]: false }));
        feilregistrerKommentar(id)
            .then(() => {
                refreshNotater();
                refetchPerson();
            })
            .catch(() => {
                setErrors((prevState) => ({ ...prevState, [id]: true }));
            })
            .finally(() => setIsFetching(false));
    };

    if (kommentarer.length === 0) {
        return null;
    }

    return (
        <div className={styles.Kommentarer}>
            <BodyShort size="small">Kommentarer</BodyShort>
            {[...kommentarer]
                .sort((a, b) => new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime())
                .map((it) => (
                    <div key={it.id} className={styles.Kommentar}>
                        <pre
                            className={classNames(
                                typeof it.feilregistrert_tidspunkt === 'string' && styles.Feilregistrert,
                            )}
                        >
                            {it.tekst} {typeof it.feilregistrert_tidspunkt === 'string' && '(feilregistert)'}
                        </pre>
                        {!it.feilregistrert_tidspunkt && innloggetSaksbehandler.oid === saksbehandlerOid && (
                            <HendelseDropdownMenu
                                feilregistrerAction={onFeilregistrerKommentar(it.id)}
                                isFetching={isFetching}
                            />
                        )}
                        {errors[it.id] && (
                            <ErrorMessage>Kunne ikke feilregistrere kommentar. Prøv igjen senere.</ErrorMessage>
                        )}
                        <HendelseDate timestamp={it.opprettet} ident={it.saksbehandlerident} />
                    </div>
                ))}
        </div>
    );
};
