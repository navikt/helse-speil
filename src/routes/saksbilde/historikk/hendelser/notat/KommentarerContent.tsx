import React, { useState } from 'react';

import { Button, VStack } from '@navikt/ds-react';

import { Kommentar, PeriodehistorikkType } from '@io/graphql';
import { finnKommentertElementType, useLeggTilKommentar } from '@state/notater';

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

    const { onLeggTilKommentar, loading, error } = useLeggTilKommentar(
        dialogRef,
        { id: historikkinnslagId, type: finnKommentertElementType(historikktype) },
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
