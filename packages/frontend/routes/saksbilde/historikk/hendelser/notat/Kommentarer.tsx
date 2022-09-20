import React, { useState } from 'react';
import classNames from 'classnames';
import { BodyShort, ErrorMessage, Loader } from '@navikt/ds-react';

import { getFormattedDatetimeString } from '@utils/date';
import { Kommentar } from '@io/graphql';
import { feilregistrerKommentar } from '@io/graphql/feilregistrerKommentar';
import { useRefreshNotater } from '@state/notater';
import { useRefetchPerson } from '@state/person';

import styles from './Kommentarer.module.css';

interface KommentarerProps {
    kommentarer: Array<Kommentar>;
}

export const Kommentarer: React.FC<KommentarerProps> = ({ kommentarer }) => {
    const [isFetching, setIsFetching] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

    const refreshNotater = useRefreshNotater();
    const refetchPerson = useRefetchPerson();

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
            <BodyShort size="small">Kommentarer:</BodyShort>
            {kommentarer.map((it) => (
                <div key={it.id} className={styles.Kommentar}>
                    <BodyShort size="small">{getFormattedDatetimeString(it.opprettet)}</BodyShort>
                    <pre
                        className={classNames(
                            styles.Notat,
                            typeof it.feilregistrert_tidspunkt === 'string' && styles.feilregistrert,
                        )}
                    >
                        {it.tekst}
                    </pre>
                    {!it.feilregistrert_tidspunkt && (
                        <button onClick={onFeilregistrerKommentar(it.id)} disabled={isFetching}>
                            Feilregistrer {isFetching && <Loader size="xsmall" />}
                        </button>
                    )}
                    {errors[it.id] && (
                        <ErrorMessage>Kunne ikke feilregistrere kommentar. Prøv igjen senere.</ErrorMessage>
                    )}
                </div>
            ))}
        </div>
    );
};
