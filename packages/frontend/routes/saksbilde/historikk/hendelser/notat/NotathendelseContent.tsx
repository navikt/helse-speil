import React from 'react';

import { useMutation } from '@apollo/client';
import { LinkButton } from '@components/LinkButton';
import { LeggTilKommentarDocument } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { Kommentarer } from './Kommentarer';
import { NotatForm } from './NotatForm';

import styles from './Notathendelse.module.css';

type NotatHendelseContentProps = {
    kommentarer: Array<Kommentar>;
    saksbehandlerOid: string;
    showAddDialog: boolean;
    setShowAddDialog: (show: boolean) => void;
    id: string;
};

export const NotatHendelseContent = ({
    kommentarer,
    saksbehandlerOid,
    showAddDialog,
    setShowAddDialog,
    id,
}: NotatHendelseContentProps) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const [leggTilKommentar, { error, loading }] = useMutation(LeggTilKommentarDocument);

    const onLeggTilKommentar = async (tekst: string) => {
        const saksbehandlerident = innloggetSaksbehandler.ident;
        if (saksbehandlerident) {
            const notatId = Number.parseInt(id);
            await leggTilKommentar({
                variables: {
                    tekst,
                    notatId,
                    saksbehandlerident,
                },
                update: (cache, { data }) => {
                    cache.writeQuery({
                        query: LeggTilKommentarDocument,
                        variables: {
                            tekst,
                            notatId,
                            saksbehandlerident,
                        },
                        data,
                    });
                    cache.modify({
                        id: cache.identify({ __typename: 'Notat', id: notatId }),
                        fields: {
                            kommentarer(eksisterendeKommentarer) {
                                return [
                                    ...eksisterendeKommentarer,
                                    {
                                        __ref: cache.identify({
                                            __typename: 'Kommentar',
                                            id: data?.leggTilKommentar?.id,
                                        }),
                                    },
                                ];
                            },
                        },
                    });
                },
            });
            setShowAddDialog(false);
        }
    };

    return (
        <div className={styles.NotatContent}>
            <Kommentarer kommentarer={kommentarer} saksbehandlerOid={saksbehandlerOid} />
            {innloggetSaksbehandler.ident &&
                (showAddDialog ? (
                    <NotatForm
                        label="Kommentar"
                        onSubmitForm={onLeggTilKommentar}
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
