import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Box, ErrorMessage, HStack, VStack } from '@navikt/ds-react';

import { useApolloClient } from '@apollo/client';
import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { usePatchKommentar } from '@io/rest/generated/dialoger/dialoger';
import { HendelseDate } from '@saksbilde/historikk/komponenter/HendelseDate';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { Kommentar as KommentarType } from '@typer/notat';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

import { KommentarDropdown } from './KommentarDropdown';

import styles from './Kommentar.module.css';

interface KommentarProps {
    kommentar: KommentarType;
    dialogRef: number | null;
}

export const Kommentar = ({ kommentar, dialogRef }: KommentarProps) => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const { feilregistrerKommentar, loading, error } = useFeilregistrerKommentar(kommentar.id, dialogRef);

    const erFeilregistrert = dayjs(kommentar.feilregistrert_tidspunkt, ISO_TIDSPUNKTFORMAT).isValid();

    return (
        <Box
            borderWidth="0 0 1 0"
            borderColor="neutral-subtle"
            marginBlock="space-0 space-8"
            paddingBlock="space-0 space-4"
        >
            <VStack key={kommentar.id}>
                <HStack align="center" justify="space-between">
                    <HendelseDate timestamp={kommentar.opprettet} ident={kommentar.saksbehandlerident} />
                    {dialogRef != null &&
                        !erFeilregistrert &&
                        innloggetSaksbehandler.ident === kommentar.saksbehandlerident && (
                            <KommentarDropdown feilregistrerAction={feilregistrerKommentar} isFetching={loading} />
                        )}
                </HStack>

                <Box
                    background={erFeilregistrert ? 'danger-soft' : undefined}
                    paddingInline={erFeilregistrert ? 'space-8' : 'space-0'}
                >
                    <BodyShortWithPreWrap
                        size="small"
                        className={erFeilregistrert ? styles.feilregistrertTekst : undefined}
                    >
                        {kommentar.tekst} {erFeilregistrert && '(feilregistert)'}
                    </BodyShortWithPreWrap>
                </Box>

                {error && <ErrorMessage>Kunne ikke feilregistrere kommentar. Prøv igjen senere.</ErrorMessage>}
            </VStack>
        </Box>
    );
};

function useFeilregistrerKommentar(kommentarId: number, dialogRef: number | null) {
    const { mutate, error } = usePatchKommentar();
    const { cache } = useApolloClient();
    const [loading, setLoading] = useState(false);

    function feilregistrerKommentar() {
        if (dialogRef === null) return;
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
