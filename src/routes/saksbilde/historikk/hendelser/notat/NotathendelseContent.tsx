import React from 'react';

import { Button, HStack } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Kommentar, LeggTilKommentarDocument } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { Kommentarer } from './Kommentarer';
import { NotatForm } from './NotatForm';

type NotatHendelseContentProps = {
    kommentarer: Array<Kommentar>;
    saksbehandlerIdent: string;
    showAddDialog: boolean;
    setShowAddDialog: (show: boolean) => void;
    dialogRef: number;
    notatId: number;
};

export const NotatHendelseContent = ({
    kommentarer,
    saksbehandlerIdent,
    showAddDialog,
    setShowAddDialog,
    dialogRef,
    notatId,
}: NotatHendelseContentProps) => {
    const { onLeggTilKommentar, loading, error } = useLeggTilKommentar(dialogRef, notatId, () =>
        setShowAddDialog(false),
    );
    return (
        <HStack gap="4">
            <Kommentarer kommentarer={kommentarer} saksbehandlerIdent={saksbehandlerIdent} />
            {showAddDialog ? (
                <NotatForm
                    label="Kommentar"
                    onSubmitForm={onLeggTilKommentar}
                    closeForm={() => setShowAddDialog(false)}
                    isFetching={loading}
                    hasError={error !== undefined}
                />
            ) : (
                <Button variant="tertiary" size="xsmall" onClick={() => setShowAddDialog(true)}>
                    Legg til ny kommentar
                </Button>
            )}
        </HStack>
    );
};

const useLeggTilKommentar = (dialogRef: number, notatId: number, hideDialog: () => void) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const [leggTilKommentar, { error, loading }] = useMutation(LeggTilKommentarDocument);

    const onLeggTilKommentar = async (tekst: string) => {
        const saksbehandlerident = innloggetSaksbehandler.ident;
        if (saksbehandlerident) {
            await leggTilKommentar({
                variables: {
                    tekst,
                    dialogRef,
                    saksbehandlerident,
                },
                update: (cache, { data }) => {
                    cache.writeQuery({
                        query: LeggTilKommentarDocument,
                        variables: {
                            tekst,
                            dialogRef,
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
            hideDialog();
        }
    };

    return {
        onLeggTilKommentar,
        loading,
        error,
    };
};
