import React from 'react';

import { Button, HStack } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Kommentar, LeggTilKommentarMedDialogRefDocument } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { Kommentarer } from './Kommentarer';
import { NotatForm } from './NotatForm';

type DialogContentProps = {
    kommentarer: Array<Kommentar>;
    saksbehandlerIdent: string;
    showAddDialog: boolean;
    setShowAddDialog: (show: boolean) => void;
    dialogRef: number;
};

export const DialogContent = ({
    kommentarer,
    saksbehandlerIdent,
    showAddDialog,
    setShowAddDialog,
    dialogRef,
}: DialogContentProps) => {
    const { onLeggTilKommentarMedDialogRef, loading, error } = useLeggTilKommentarMedDialogRef(dialogRef, () =>
        setShowAddDialog(false),
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

const useLeggTilKommentarMedDialogRef = (id: number, hideDialog: () => void) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const [leggTilKommentarMedDialogRef, { error, loading }] = useMutation(LeggTilKommentarMedDialogRefDocument);

    const onLeggTilKommentarMedDialogRef = async (tekst: string) => {
        const saksbehandlerident = innloggetSaksbehandler.ident;
        if (saksbehandlerident) {
            const dialogRef = id;
            await leggTilKommentarMedDialogRef({
                variables: {
                    tekst,
                    dialogRef,
                    saksbehandlerident,
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
