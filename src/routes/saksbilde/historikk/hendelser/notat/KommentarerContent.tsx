import React, { useState } from 'react';

import { Button, VStack } from '@navikt/ds-react';

import { ApolloCache, useMutation } from '@apollo/client';
import { Kommentar, LeggTilKommentarDocument, PeriodehistorikkType } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { Kommentarer } from './Kommentarer';
import { NotatForm } from './NotatForm';

type KommentarerContentProps = {
    historikktype: PeriodehistorikkType;
    kommentarer: Array<Kommentar>;
    dialogRef: number;
    historikkinnslagId: number;
};

export const KommentarerContent = ({
    historikktype,
    kommentarer,
    dialogRef,
    historikkinnslagId,
}: KommentarerContentProps) => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const { onLeggTilKommentar, loading, error } = useLeggTilKommentarMedDialogRef(
        dialogRef,
        historikkinnslagId,
        historikktype,
        () => setShowAddDialog(false),
    );
    return (
        <VStack gap="4" align="start">
            <Kommentarer kommentarer={kommentarer} />
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
        </VStack>
    );
};

const useLeggTilKommentarMedDialogRef = (
    dialogRef: number,
    historikkinnslagId: number,
    historikktype: PeriodehistorikkType,
    hideDialog: () => void,
) => {
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
        onLeggTilKommentar,
        loading,
        error,
    };
};

const finnCacheId = (cache: ApolloCache<any>, historikkinnslagId: number, historikktype: PeriodehistorikkType) => {
    switch (historikktype) {
        case PeriodehistorikkType.LeggPaVent:
            return cache.identify({ __typename: 'LagtPaVent', id: historikkinnslagId });
        case PeriodehistorikkType.EndrePaVent:
            return cache.identify({ __typename: 'EndrePaVent', id: historikkinnslagId });
        case PeriodehistorikkType.TotrinnsvurderingRetur:
            return cache.identify({ __typename: 'TotrinnsvurderingRetur', id: historikkinnslagId });
        default:
            return undefined;
    }
};
