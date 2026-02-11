import dayjs from 'dayjs';
import React from 'react';

import { Box, ErrorMessage, HStack, VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { HendelseDate } from '@saksbilde/historikk/komponenter/HendelseDate';
import styles from '@saksbilde/historikk/komponenter/kommentarer/Kommentar.module.css';
import { KommentarDropdown } from '@saksbilde/historikk/komponenter/kommentarer/KommentarDropdown';
import { Kommentar as KommentarType } from '@typer/notat';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

interface KommentarVisningProps {
    kommentar: KommentarType;
    loading: boolean;
    hasError: boolean;
    feilregistrerKommentar: () => void;
    innloggetSaksbehandlerIdent?: string;
}

export function KommentarVisning({
    kommentar,
    innloggetSaksbehandlerIdent,
    loading,
    hasError,
    feilregistrerKommentar,
}: KommentarVisningProps) {
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
                    {!erFeilregistrert && innloggetSaksbehandlerIdent === kommentar.saksbehandlerident && (
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

                {hasError && <ErrorMessage>Kunne ikke feilregistrere kommentar. Prøv igjen senere.</ErrorMessage>}
            </VStack>
        </Box>
    );
}
