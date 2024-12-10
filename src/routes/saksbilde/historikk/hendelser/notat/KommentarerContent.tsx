import React, { useState } from 'react';

import { Kommentar, PeriodehistorikkType } from '@io/graphql';
import { LeggTilKommentar } from '@saksbilde/historikk/hendelser/notat/LeggTilKommentar';
import { finnKommentertElementType, useLeggTilKommentar } from '@state/notater';

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
