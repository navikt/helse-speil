import dayjs from 'dayjs';
import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { KommentarFormFields } from '@form-schemas/kommentarSkjema';
import { usePostKommentar } from '@io/rest/generated/dialoger/dialoger';
import { LeggTilNyKommentarForm } from '@saksbilde/historikk/komponenter/kommentarer/LeggTilNyKommentarForm';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { mapPerioder, useOppdaterPersonICache } from '@state/person';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

type LeggTilNyKommentarProps = {
    dialogRef: number;
    historikkinnslagId: number;
    åpneKommentarvisning: () => void;
};

export const LeggTilHendelseKommentar = ({
    dialogRef,
    historikkinnslagId,
    åpneKommentarvisning,
}: LeggTilNyKommentarProps) => {
    const [visLeggTilKommentar, setVisLeggTilKommentar] = useState(false);

    const { leggTilKommentar, loading, error } = useLeggTilKommentar(dialogRef, historikkinnslagId, () => {
        setVisLeggTilKommentar(false);
        åpneKommentarvisning();
    });

    const errorMessage: string | undefined =
        error == undefined
            ? undefined
            : error.status === 401
              ? 'Du har blitt logget ut'
              : 'Kommentaren kunne ikke lagres';

    return visLeggTilKommentar ? (
        <LeggTilNyKommentarForm
            loading={loading}
            onLeggTilKommentar={leggTilKommentar}
            errorMessage={errorMessage}
            closeForm={() => setVisLeggTilKommentar(false)}
        />
    ) : (
        <span>
            <VisHvisSkrivetilgang>
                <Button
                    size="xsmall"
                    variant="tertiary"
                    icon={<PlusCircleFillIcon aria-hidden />}
                    onClick={() => setVisLeggTilKommentar(true)}
                >
                    Legg til ny kommentar
                </Button>
            </VisHvisSkrivetilgang>
        </span>
    );
};

function useLeggTilKommentar(dialogRef: number, historikkinnslagId: number, onSuccess: () => void) {
    const [isLoading, setIsLoading] = useState(false);
    const { ident: saksbehandlerident } = useInnloggetSaksbehandler();
    const { mutate, error, isPending: loading } = usePostKommentar();
    const oppdaterPersonICache = useOppdaterPersonICache();

    const leggTilKommentar: SubmitHandler<KommentarFormFields> = async ({ tekst }) => {
        setIsLoading(true);
        mutate(
            {
                dialogId: dialogRef,
                data: {
                    tekst,
                },
            },
            {
                onSuccess: async ({ id }) => {
                    const nyKommentar = {
                        id,
                        tekst,
                        opprettet: dayjs().format(ISO_TIDSPUNKTFORMAT),
                        saksbehandlerident,
                        feilregistrert_tidspunkt: null,
                    };
                    oppdaterPersonICache((person) =>
                        mapPerioder(person, (periode) => ({
                            ...periode,
                            historikkinnslag: periode.historikkinnslag.map((innslag) =>
                                innslag.id === historikkinnslagId && 'kommentarer' in innslag
                                    ? { ...innslag, kommentarer: [...innslag.kommentarer, nyKommentar] }
                                    : innslag,
                            ),
                        })),
                    );
                    setIsLoading(false);
                    onSuccess();
                },
                onError: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    return {
        leggTilKommentar,
        loading: loading || isLoading,
        error,
    };
}
