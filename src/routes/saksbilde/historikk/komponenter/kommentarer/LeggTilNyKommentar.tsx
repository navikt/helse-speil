import React, { useState } from 'react';

import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { VisForSaksbehandler } from '@components/VisForSaksbehandler';
import { PeriodehistorikkType } from '@io/graphql';
import { LeggTilNyKommentarForm } from '@saksbilde/historikk/komponenter/kommentarer/LeggTilNyKommentarForm';
import { finnKommentertElementType, useLeggTilKommentar } from '@state/notater';
import { apolloErrorCode } from '@utils/error';

type LeggTilNyKommentarProps = {
    dialogRef: number;
    historikkinnslagId: number;
    historikktype?: PeriodehistorikkType;
};

export const LeggTilNyKommentar = ({ dialogRef, historikkinnslagId, historikktype }: LeggTilNyKommentarProps) => {
    const [visLeggTilKommentar, setVisLeggTilKommentar] = useState(false);

    const { onLeggTilKommentar, loading, error } = useLeggTilKommentar(
        dialogRef,
        { id: historikkinnslagId, type: finnKommentertElementType(historikktype) },
        () => setVisLeggTilKommentar(false),
    );

    const errorMessage: string | undefined =
        error == undefined
            ? undefined
            : apolloErrorCode(error) === 401
              ? 'Du har blitt logget ut'
              : 'Kommentaren kunne ikke lagres';

    return visLeggTilKommentar ? (
        <LeggTilNyKommentarForm
            loading={loading}
            onLeggTilKommentar={onLeggTilKommentar}
            errorMessage={errorMessage}
            closeForm={() => setVisLeggTilKommentar(false)}
        />
    ) : (
        <span>
            <VisForSaksbehandler>
                <Button
                    size="xsmall"
                    variant="tertiary"
                    icon={<PlusCircleFillIcon />}
                    onClick={() => setVisLeggTilKommentar(true)}
                >
                    Legg til ny kommentar
                </Button>
            </VisForSaksbehandler>
        </span>
    );
};
