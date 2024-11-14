import React from 'react';

import { Button, HStack } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Kommentar, LeggTilKommentarDocument } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { Kommentarer } from './Kommentarer';
import { NotatForm } from './NotatForm';

type DialogContentProps = {
    kommentarer: Array<Kommentar>;
    saksbehandlerIdent: string;
    showAddDialog: boolean;
    setShowAddDialog: (show: boolean) => void;
    dialogRef: number;
    historikkinnslagId: number;
};

export const DialogContent = ({
    kommentarer,
    saksbehandlerIdent,
    showAddDialog,
    setShowAddDialog,
    dialogRef,
    historikkinnslagId,
}: DialogContentProps) => {
    const { onLeggTilKommentarMedDialogRef, loading, error } = useLeggTilKommentarMedDialogRef(
        dialogRef,
        historikkinnslagId,
        () => setShowAddDialog(false),
    );
    return (
        <HStack gap="4">
            <Kommentarer kommentarer={kommentarer} saksbehandlerIdent={saksbehandlerIdent} />
            {showAddDialog ? (
                <NotatForm
                    label="Kommentar"
                    onSubmitForm={onLeggTilKommentarMedDialogRef}
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

const useLeggTilKommentarMedDialogRef = (dialogRef: number, historikkinnslagId: number, hideDialog: () => void) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const [leggTilKommentarMedDialogRef, { error, loading }] = useMutation(LeggTilKommentarDocument);

    const onLeggTilKommentarMedDialogRef = async (tekst: string) => {
        const saksbehandlerident = innloggetSaksbehandler.ident;
        if (saksbehandlerident) {
            await leggTilKommentarMedDialogRef({
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
                        id: cache.identify({ __typename: 'LagtPaVent', id: historikkinnslagId }),
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
        onLeggTilKommentarMedDialogRef,
        loading,
        error,
    };
};
