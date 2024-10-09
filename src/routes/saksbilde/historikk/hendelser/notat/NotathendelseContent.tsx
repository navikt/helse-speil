import React from 'react';

import { Button, HStack } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { Kommentar, LeggTilKommentarDocument } from '@io/graphql';
import { useInnloggetSaksbehandler } from '@state/authentication';

import { Kommentarer } from './Kommentarer';
import { NotatForm } from './NotatForm';

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
    const { onLeggTilKommentar, loading, error } = useLeggTilKommentar(id, () => setShowAddDialog(false));
    return (
        <HStack gap="4">
            <Kommentarer kommentarer={kommentarer} saksbehandlerOid={saksbehandlerOid} />
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

const useLeggTilKommentar = (id: string, hideDialog: () => void) => {
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
            hideDialog();
        }
    };

    return {
        onLeggTilKommentar,
        loading,
        error,
    };
};
