import React, { Dispatch } from 'react';

import { LinkButton } from '@components/LinkButton';
import { leggTilKommentar } from '@io/graphql/leggTilKommentar';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useRefreshNotater } from '@state/notater';
import { useRefetchPerson } from '@state/person';

import { Kommentarer } from './Kommentarer';
import { NotatForm } from './NotatForm';
import { Action, State } from './types';

import styles from './Notathendelse.module.css';

type NotatHendelseContentProps = {
    kommentarer: Array<Kommentar>;
    saksbehandlerOid: string;
    state: State;
    dispatch: Dispatch<Action>;
    id: string;
};

export const NotatHendelseContent = ({
    kommentarer,
    saksbehandlerOid,
    state,
    dispatch,
    id,
}: NotatHendelseContentProps) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const refreshNotater = useRefreshNotater();
    const refetchPerson = useRefetchPerson();

    const onLeggTilKommentar = (notatId: number, saksbehandlerident: string) => (tekst: string) => {
        dispatch({ type: 'FetchAction' });
        leggTilKommentar({ tekst, notatId, saksbehandlerident })
            .then(() => {
                refreshNotater();
                refetchPerson().finally(() => {
                    dispatch({ type: 'FetchSuccessAction' });
                });
            })
            .catch(() => {
                dispatch({ type: 'ErrorAction', id: 'leggTilKommentar' });
            });
    };

    return (
        <div className={styles.NotatContent}>
            <Kommentarer kommentarer={kommentarer} saksbehandlerOid={saksbehandlerOid} />
            {innloggetSaksbehandler.oid === saksbehandlerOid &&
                innloggetSaksbehandler.ident &&
                (state.showAddDialog ? (
                    <NotatForm
                        label="Kommentar"
                        onSubmitForm={onLeggTilKommentar(Number.parseInt(id), innloggetSaksbehandler.ident)}
                        closeForm={() => dispatch({ type: 'ToggleDialogAction', value: false })}
                        isFetching={state.isFetching}
                        hasError={typeof state.errors.leggTilKommentar === 'string'}
                    />
                ) : (
                    <LinkButton
                        className={styles.LeggTilKommentarButton}
                        onClick={() => dispatch({ type: 'ToggleDialogAction', value: true })}
                    >
                        Legg til ny kommentar
                    </LinkButton>
                ))}
        </div>
    );
};
