import React, { useState } from 'react';

import { usePatchKommentar } from '@io/rest/generated/dialoger/dialoger';
import { getGetNotaterForVedtaksperiodeQueryKey } from '@io/rest/generated/notater/notater';
import { KommentarVisning } from '@saksbilde/historikk/komponenter/kommentarer/KommentarVisning';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useQueryClient } from '@tanstack/react-query';
import { Kommentar as KommentarType } from '@typer/notat';

interface NotatKommentarProps {
    kommentar: KommentarType;
    vedtaksperiodeId: string;
    dialogRef: number;
}

export const NotatKommentar = ({ kommentar, vedtaksperiodeId, dialogRef }: NotatKommentarProps) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const { feilregistrerKommentar, loading, error } = useFeilregistrerKommentar(
        kommentar.id,
        vedtaksperiodeId,
        dialogRef,
    );

    return (
        <KommentarVisning
            kommentar={kommentar}
            loading={loading}
            hasError={error != undefined}
            feilregistrerKommentar={feilregistrerKommentar}
            innloggetSaksbehandlerIdent={innloggetSaksbehandler.ident}
        />
    );
};

function useFeilregistrerKommentar(kommentarId: number, vedtaksperiodeId: string, dialogRef: number) {
    const { mutate, error } = usePatchKommentar();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    function feilregistrerKommentar() {
        setLoading(true);
        mutate(
            {
                dialogId: dialogRef,
                kommentarId: kommentarId,
                data: {
                    feilregistrert: true,
                },
            },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries({
                        queryKey: getGetNotaterForVedtaksperiodeQueryKey(vedtaksperiodeId),
                    });
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                },
            },
        );
    }

    return { feilregistrerKommentar, loading, error };
}
