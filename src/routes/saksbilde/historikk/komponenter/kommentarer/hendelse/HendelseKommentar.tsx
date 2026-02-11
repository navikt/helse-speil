import dayjs from 'dayjs';
import React, { useState } from 'react';

import { useApolloClient } from '@apollo/client';
import { usePatchKommentar } from '@io/rest/generated/dialoger/dialoger';
import { KommentarVisning } from '@saksbilde/historikk/komponenter/kommentarer/KommentarVisning';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { Kommentar as KommentarType } from '@typer/notat';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

interface HendelseKommentarProps {
    kommentar: KommentarType;
    dialogRef: number;
}

export const HendelseKommentar = ({ kommentar, dialogRef }: HendelseKommentarProps) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const { feilregistrerKommentar, loading, error } = useFeilregistrerKommentar(kommentar.id, dialogRef);

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

function useFeilregistrerKommentar(kommentarId: number, dialogRef: number) {
    const { mutate, error } = usePatchKommentar();
    const { cache } = useApolloClient();
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
                    cache.modify({
                        id: cache.identify({ __typename: 'Kommentar', id: kommentarId }),
                        fields: {
                            feilregistrert_tidspunkt() {
                                return dayjs().format(ISO_TIDSPUNKTFORMAT) ?? '';
                            },
                        },
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
