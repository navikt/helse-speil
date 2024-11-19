import React from 'react';

import { Button, HStack } from '@navikt/ds-react';

import { ApolloCache, useMutation } from '@apollo/client';
import { Kommentar, LeggTilKommentarDocument, PeriodehistorikkType } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { Kommentarer } from './Kommentarer';
import { NotatForm } from './NotatForm';

type DialogContentProps = {
    historikktype: PeriodehistorikkType;
    kommentarer: Array<Kommentar>;
    showAddDialog: boolean;
    setShowAddDialog: (show: boolean) => void;
    dialogRef: number;
    historikkinnslagId: number;
};

export const DialogContent = ({
    historikktype,
    kommentarer,
    showAddDialog,
    setShowAddDialog,
    dialogRef,
    historikkinnslagId,
}: DialogContentProps) => {
    const { onLeggTilKommentarMedDialogRef, loading, error } = useLeggTilKommentarMedDialogRef(
        dialogRef,
        historikkinnslagId,
        historikktype,
        () => setShowAddDialog(false),
    );
    return (
        <HStack gap="4">
            <Kommentarer kommentarer={kommentarer} />
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

const useLeggTilKommentarMedDialogRef = (
    dialogRef: number,
    historikkinnslagId: number,
    historikktype: PeriodehistorikkType,
    hideDialog: () => void,
) => {
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
                        id: finnCacheId(cache, historikkinnslagId, historikktype),
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

const finnCacheId = (cache: ApolloCache<any>, historikkinnslagId: number, historikktype: PeriodehistorikkType) => {
    switch (historikktype) {
        case PeriodehistorikkType.LeggPaVent:
            return cache.identify({ __typename: 'LagtPaVent', id: historikkinnslagId });
        case PeriodehistorikkType.TotrinnsvurderingRetur:
            return cache.identify({ __typename: 'TotrinnsvurderingRetur', id: historikkinnslagId });
        default:
            return undefined;
    }
};
