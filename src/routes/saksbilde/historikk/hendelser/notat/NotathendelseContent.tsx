import React from 'react';

import { Kommentar } from '@io/graphql';
import { LeggTilKommentar } from '@saksbilde/historikk/hendelser/notat/LeggTilKommentar';
import { useLeggTilKommentar } from '@state/notater';

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
        <LeggTilKommentar
            kommentarer={kommentarer}
            showAddDialog={showAddDialog}
            setShowAddDialog={setShowAddDialog}
            onLeggTilKommentar={onLeggTilKommentar}
            loading={loading}
            hasError={error != undefined}
        />
    );
};
