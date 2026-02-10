import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { KommentarFormFields } from '@/form-schemas/kommentarSkjema';
import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { usePostKommentar } from '@io/rest/generated/dialoger/dialoger';
import { getGetNotaterForVedtaksperiodeQueryKey } from '@io/rest/generated/notater/notater';
import { LeggTilNyKommentarForm } from '@saksbilde/historikk/komponenter/kommentarer/LeggTilNyKommentarForm';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useQueryClient } from '@tanstack/react-query';

type LeggTilNyKommentarProps = {
    dialogRef: number;
    vedtaksperiodeId: string;
    åpneKommentarvisning: () => void;
};

export const LeggTilNotatKommentar = ({
    dialogRef,
    vedtaksperiodeId,
    åpneKommentarvisning,
}: LeggTilNyKommentarProps) => {
    const [visLeggTilKommentar, setVisLeggTilKommentar] = useState(false);

    const { leggTilKommentar, loading, error } = useLeggTilKommentar(dialogRef, vedtaksperiodeId, () => {
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
                    icon={<PlusCircleFillIcon />}
                    onClick={() => setVisLeggTilKommentar(true)}
                >
                    Legg til ny kommentar
                </Button>
            </VisHvisSkrivetilgang>
        </span>
    );
};

function useLeggTilKommentar(dialogRef: number, vedtaksperiodeId: string, onSuccess: () => void) {
    const [isLoading, setIsLoading] = useState(false);
    const { ident: saksbehandlerident } = useInnloggetSaksbehandler();
    const { mutate, error, isPending: loading } = usePostKommentar();
    const queryClient = useQueryClient();

    const leggTilKommentar: SubmitHandler<KommentarFormFields> = async ({ tekst }) => {
        if (saksbehandlerident) {
            setIsLoading(true);
            mutate(
                {
                    dialogId: dialogRef,
                    data: {
                        tekst,
                    },
                },
                {
                    onSuccess: async () => {
                        await queryClient.invalidateQueries({
                            queryKey: getGetNotaterForVedtaksperiodeQueryKey(vedtaksperiodeId),
                        });
                        setIsLoading(false);
                        onSuccess();
                    },
                    onError: () => {
                        setIsLoading(false);
                    },
                },
            );
        }
    };

    return {
        leggTilKommentar,
        loading: loading || isLoading,
        error,
    };
}
