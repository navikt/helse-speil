import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Box, ErrorMessage, HStack, VStack } from '@navikt/ds-react';

import { useApolloClient } from '@apollo/client';
import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { Kommentar as GraphQLKommentar } from '@io/graphql';
import { usePatchKommentar } from '@io/rest/generated/dialoger/dialoger';
import { HendelseDate } from '@saksbilde/historikk/komponenter/HendelseDate';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

import { KommentarDropdown } from './KommentarDropdown';

import styles from './Kommentar.module.css';

interface KommentarProps {
    kommentar: GraphQLKommentar;
    dialogRef: number | null;
}

export const Kommentar = ({ kommentar, dialogRef }: KommentarProps) => {
    const { mutate, isPending: loading, error } = usePatchKommentar();
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const { cache } = useApolloClient();
    const [isLoading, setIsLoading] = useState(false);

    function doFeilregistrerKommentar() {
        if (dialogRef === null) return;
        setIsLoading(true);
        mutate(
            {
                dialogId: dialogRef,
                kommentarId: kommentar.id,
                data: {
                    feilregistrert: true,
                },
            },
            {
                onSuccess: () => {
                    cache.modify({
                        id: cache.identify({ __typename: 'Kommentar', id: kommentar.id }),
                        fields: {
                            feilregistrert_tidspunkt() {
                                return dayjs().format(ISO_TIDSPUNKTFORMAT) ?? '';
                            },
                        },
                    });
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                },
            },
        );
    }

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
                            <KommentarDropdown
                                feilregistrerAction={doFeilregistrerKommentar}
                                isFetching={loading || isLoading}
                            />
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
