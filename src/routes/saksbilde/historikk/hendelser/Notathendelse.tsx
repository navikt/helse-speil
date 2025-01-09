import React, { ReactElement } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, ErrorMessage, VStack } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { BodyLongWithPreWrap } from '@components/BodyLongWithPreWrap';
import { FeilregistrerNotatMutationDocument } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkChatIkon, HistorikkCheckmarkCircleIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { KommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/KommentarSeksjon';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { NotathendelseObject } from '@typer/historikk';

type NotathendelseProps = Omit<NotathendelseObject, 'type'>;

export const Notathendelse = ({
    id,
    dialogRef,
    tekst,
    erOpphevStans,
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
            icon={erOpphevStans ? <HistorikkCheckmarkCircleIkon /> : <HistorikkChatIkon />}
            title={toNotatTittel(erOpphevStans) + (feilregistrert ? ' (feilregistrert)' : '')}
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
                        <BodyLongWithPreWrap>{øvrigeTekstlinjer}</BodyLongWithPreWrap>
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

const toNotatTittel = (erOpphevStans: boolean): string => {
    if (erOpphevStans) {
        return 'Stans opphevet';
    } else {
        return 'Notat';
    }
};
