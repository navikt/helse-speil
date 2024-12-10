import React from 'react';

import { Button, VStack } from '@navikt/ds-react';

import { Kommentar } from '@io/graphql';
import { useLeggTilKommentar } from '@state/notater';

import { Kommentarer } from './Kommentarer';
import { NotatForm } from './NotatForm';

type NotatHendelseContentProps = {
    kommentarer: Array<Kommentar>;
    showAddDialog: boolean;
    setShowAddDialog: (show: boolean) => void;
    dialogRef: number;
    notatId: number;
};

export const NotatHendelseContent = ({
    kommentarer,
    showAddDialog,
    setShowAddDialog,
    dialogRef,
    notatId,
}: NotatHendelseContentProps) => {
    const { onLeggTilKommentar, loading, error } = useLeggTilKommentar(dialogRef, { id: notatId, type: 'Notat' }, () =>
        setShowAddDialog(false),
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
