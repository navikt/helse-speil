import React, { useState } from 'react';

import { PeriodehistorikkType } from '@io/graphql';
import { NotatForm } from '@saksbilde/historikk/hendelser/notat/NotatForm';
import { InteractableLinkText } from '@saksbilde/historikk/komponenter/InteractableLinkText';
import { finnKommentertElementType, useLeggTilKommentar } from '@state/notater';

type PåVentLeggTilKommentarProps = {
    historikktype: PeriodehistorikkType;
    dialogRef: number;
    historikkinnslagId: number;
};

export const PåVentLeggTilKommentar = ({
    historikktype,
    dialogRef,
    historikkinnslagId,
}: PåVentLeggTilKommentarProps) => {
    const [showAddDialog, setShowAddDialog] = useState(false);

    const { onLeggTilKommentar, loading, error } = useLeggTilKommentar(
        dialogRef,
        { id: historikkinnslagId, type: finnKommentertElementType(historikktype) },
        () => setShowAddDialog(false),
    );

    return showAddDialog ? (
        <NotatForm
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
