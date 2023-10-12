import React from 'react';

import { useMutation } from '@apollo/client';
import { LinkButton } from '@components/LinkButton';
import { FetchNotaterDocument, FetchPersonDocument, LeggTilKommentarDocument } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { client } from '../../../../apolloClient';
import { Kommentarer } from './Kommentarer';
import { NotatForm } from './NotatForm';

import styles from './Notathendelse.module.css';

type NotatHendelseContentProps = {
    kommentarer: Array<Kommentar>;
    saksbehandlerOid: string;
    showAddDialog: boolean;
    setShowAddDialog: (show: boolean) => void;
    id: string;
    vedtaksperiodeId: string;
};

export const NotatHendelseContent = ({
    kommentarer,
    saksbehandlerOid,
    showAddDialog,
    setShowAddDialog,
    id,
    vedtaksperiodeId,
}: NotatHendelseContentProps) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const [leggTilKommentar, { error, loading }] = useMutation(LeggTilKommentarDocument, {
        refetchQueries: [{ query: FetchNotaterDocument, variables: { forPerioder: [vedtaksperiodeId] } }],
    });

    const onLeggTilKommentar = (notatId: number, saksbehandlerident: string) => (tekst: string) => {
        leggTilKommentar({ variables: { tekst, notatId, saksbehandlerident } }).then(() => {
            client.refetchQueries({ include: [FetchPersonDocument], onQueryUpdated: () => setShowAddDialog(false) });
        });
    };

    return (
        <div className={styles.NotatContent}>
            <Kommentarer kommentarer={kommentarer} saksbehandlerOid={saksbehandlerOid} />
            {innloggetSaksbehandler.ident &&
                (showAddDialog ? (
                    <NotatForm
                        label="Kommentar"
                        onSubmitForm={onLeggTilKommentar(Number.parseInt(id), innloggetSaksbehandler.ident)}
                        closeForm={() => setShowAddDialog(false)}
                        isFetching={loading}
                        hasError={error !== undefined}
                    />
                ) : (
                    <LinkButton className={styles.LeggTilKommentarButton} onClick={() => setShowAddDialog(true)}>
                        Legg til ny kommentar
                    </LinkButton>
                ))}
        </div>
    );
};
