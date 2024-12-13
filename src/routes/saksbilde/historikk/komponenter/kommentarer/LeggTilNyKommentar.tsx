import React, { useState } from 'react';

import { PeriodehistorikkType } from '@io/graphql';
import { InteractableLinkText } from '@saksbilde/historikk/komponenter/InteractableLinkText';
import { LeggTilNyKommentarForm } from '@saksbilde/historikk/komponenter/kommentarer/LeggTilNyKommentarForm';
import { finnKommentertElementType, useLeggTilKommentar } from '@state/notater';

type LeggTilNyKommentarProps = {
    dialogRef: number;
    historikkinnslagId: number;
    historikktype?: PeriodehistorikkType;
};

export const LeggTilNyKommentar = ({ dialogRef, historikkinnslagId, historikktype }: LeggTilNyKommentarProps) => {
    const [showAddDialog, setShowAddDialog] = useState(false);

    const { onLeggTilKommentar, loading, error } = useLeggTilKommentar(
        dialogRef,
        { id: historikkinnslagId, type: finnKommentertElementType(historikktype) },
        () => setShowAddDialog(false),
    );

    return showAddDialog ? (
        <LeggTilNyKommentarForm
            label="Kommentar"
            onSubmitForm={onLeggTilKommentar}
            closeForm={() => setShowAddDialog(false)}
            isFetching={loading}
            hasError={error != undefined}
        />
    ) : (
        <InteractableLinkText onInteract={() => setShowAddDialog(true)}>Legg til ny kommentar</InteractableLinkText>
    );
};
