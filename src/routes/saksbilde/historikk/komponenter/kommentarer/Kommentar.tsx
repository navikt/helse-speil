import dayjs from 'dayjs';
import React from 'react';

import { BodyShort, Box, ErrorMessage, HStack, VStack } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { FeilregistrerKommentarMutationDocument, Kommentar as GraphQLKommentar } from '@io/graphql';
import { HendelseDate } from '@saksbilde/historikk/komponenter/HendelseDate';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

import { KommentarDropdown } from './KommentarDropdown';

interface KommentarProps {
    kommentar: GraphQLKommentar;
}

export const Kommentar = ({ kommentar }: KommentarProps) => {
    const [feilregistrerKommentar, { loading, error }] = useMutation(FeilregistrerKommentarMutationDocument);
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const onFeilregistrerKommentar = (id: number) => () => {
        void feilregistrerKommentar({
            variables: { id: id },
            update: (cache, { data }) => {
                cache.modify({
                    id: cache.identify({ __typename: 'Kommentar', id: id }),
                    fields: {
                        feilregistrert_tidspunkt() {
                            return data?.feilregistrerKommentar?.feilregistrert_tidspunkt?.toString() ?? '';
                        },
                    },
                });
            },
        });
    };

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
                    {!erFeilregistrert && innloggetSaksbehandler.ident === kommentar.saksbehandlerident && (
                        <KommentarDropdown
                            feilregistrerAction={onFeilregistrerKommentar(kommentar.id)}
                            isFetching={loading}
                        />
                    )}
                </HStack>

                <Box
                    background={erFeilregistrert ? 'danger-soft' : undefined}
                    paddingInline={erFeilregistrert ? 'space-8' : 'space-0'}
                >
                    <BodyShort size="small" style={erFeilregistrert ? { fontStyle: 'italic' } : {}}>
                        {kommentar.tekst} {erFeilregistrert && '(feilregistert)'}
                    </BodyShort>
                </Box>

                {error && <ErrorMessage>Kunne ikke feilregistrere kommentar. Prøv igjen senere.</ErrorMessage>}
            </VStack>
        </Box>
    );
};
