import React from 'react';

import { Button, VStack } from '@navikt/ds-react';

import { Kommentar } from '@io/graphql';
import { Kommentarer } from '@saksbilde/historikk/hendelser/notat/Kommentarer';
import { NotatForm } from '@saksbilde/historikk/hendelser/notat/NotatForm';

interface LeggTilKommentarProps {
    kommentarer: Array<Kommentar>;
    showAddDialog: boolean;
    setShowAddDialog: (show: boolean) => void;
    onLeggTilKommentar: (tekst: string) => Promise<void>;
    loading: boolean;
    hasError: boolean;
}

export const LeggTilKommentar = ({
    kommentarer,
    showAddDialog,
    onLeggTilKommentar,
    setShowAddDialog,
    loading,
    hasError,
}: LeggTilKommentarProps) => (
    <VStack gap="4" align="start">
        <Kommentarer kommentarer={kommentarer} readOnly={false} />
        {showAddDialog ? (
            <NotatForm
                label="Kommentar"
                onSubmitForm={onLeggTilKommentar}
                closeForm={() => setShowAddDialog(false)}
                isFetching={loading}
                hasError={hasError}
            />
        ) : (
            <Button variant="tertiary" size="xsmall" onClick={() => setShowAddDialog(true)}>
                Legg til ny kommentar
            </Button>
        )}
    </VStack>
);
