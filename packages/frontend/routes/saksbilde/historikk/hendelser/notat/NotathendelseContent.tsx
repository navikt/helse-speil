import React, { Dispatch } from 'react';

import { useMutation } from '@apollo/client';
import { LinkButton } from '@components/LinkButton';
import { FetchNotaterDocument, LeggTilKommentarDocument } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';
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
    vedtaksperiodeId: string;
};

export const NotatHendelseContent = ({
    kommentarer,
    saksbehandlerOid,
    state,
    dispatch,
    id,
    vedtaksperiodeId,
}: NotatHendelseContentProps) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const refetchPerson = useRefetchPerson();
    const [leggTilKommentar] = useMutation(LeggTilKommentarDocument, {
        refetchQueries: [{ query: FetchNotaterDocument, variables: { forPerioder: [vedtaksperiodeId] } }],
    });

    const onLeggTilKommentar = (notatId: number, saksbehandlerident: string) => (tekst: string) => {
        dispatch({ type: 'FetchAction' });
        leggTilKommentar({ variables: { tekst, notatId, saksbehandlerident } })
            .then(() => {
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
            {innloggetSaksbehandler.ident &&
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
