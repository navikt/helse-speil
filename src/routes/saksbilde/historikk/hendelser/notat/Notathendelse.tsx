import React, { ReactElement } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, BodyLong, Button, ErrorMessage, VStack } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { FeilregistrerNotatMutationDocument } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/hendelser/Expandable';
import { NotatIkon } from '@saksbilde/historikk/hendelser/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { KommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/KommentarSeksjon';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { NotathendelseObject } from '@typer/historikk';
import { NotatType } from '@typer/notat';

type NotathendelseProps = Omit<NotathendelseObject, 'type'>;

export const Notathendelse = ({
    id,
    dialogRef,
    tekst,
    notattype,
    saksbehandler,
    timestamp,
    feilregistrert,
    kommentarer,
}: NotathendelseProps): ReactElement => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const [feilregistrerNotat, { loading, error }] = useMutation(FeilregistrerNotatMutationDocument, {
        variables: { id: parseInt(id) },
        update: (cache, { data }) => {
            cache.modify({
                id: cache.identify({ __typename: 'Notat', id: data?.feilregistrerNotat?.id }),
                fields: {
                    feilregistrert() {
                        return true;
                    },
                    feilregistert_tidspunkt() {
                        return data?.feilregistrerNotat?.feilregistrert_tidspunkt ?? '';
                    },
                },
            });
        },
    });

    const førsteTekstlinje = tekst.split(/\r?\n/, 1)[0]!;
    const øvrigeTekstlinjer = tekst.slice(førsteTekstlinje.length).trim();
    return (
        <Historikkhendelse
            icon={<NotatIkon notattype={notattype} />}
            title={toNotatTittel(notattype) + (feilregistrert ? ' (feilregistrert)' : '')}
            kontekstknapp={
                !feilregistrert && innloggetSaksbehandler.ident === saksbehandler ? (
                    <ActionMenu>
                        <ActionMenu.Trigger>
                            <Button
                                icon={<MenuElipsisHorizontalIcon />}
                                title="Alternativer"
                                variant="tertiary"
                                size="xsmall"
                                loading={loading}
                            />
                        </ActionMenu.Trigger>
                        <ActionMenu.Content>
                            <ActionMenu.Item onSelect={() => feilregistrerNotat()}>Feilregistrer</ActionMenu.Item>
                        </ActionMenu.Content>
                    </ActionMenu>
                ) : undefined
            }
            timestamp={timestamp}
            saksbehandler={saksbehandler}
            aktiv={true}
        >
            {error && <ErrorMessage>Kunne ikke feilregistrere notat. Prøv igjen senere.</ErrorMessage>}
            <VStack gap="0">
                {førsteTekstlinje}
                {øvrigeTekstlinjer !== '' && (
                    <Expandable>
                        <BodyLong style={{ whiteSpace: 'pre-wrap' }}>{øvrigeTekstlinjer}</BodyLong>
                    </Expandable>
                )}
            </VStack>
            <KommentarSeksjon
                kommentarer={kommentarer}
                dialogRef={dialogRef}
                historikkinnslagId={Number.parseInt(id)}
            />
        </Historikkhendelse>
    );
};

const toNotatTittel = (notattype: NotatType): string => {
    switch (notattype) {
        case 'OpphevStans':
            return 'Stans opphevet';
        case 'PaaVent':
            return 'Lagt på vent';
        case 'Retur':
            return 'Returnert';
        default:
            return 'Notat';
    }
};
