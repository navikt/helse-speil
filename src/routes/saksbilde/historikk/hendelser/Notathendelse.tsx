import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, ErrorMessage, VStack } from '@navikt/ds-react';

import { useApolloClient } from '@apollo/client';
import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { usePatchNotat } from '@io/rest/generated/notater/notater';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkChatIkon, HistorikkCheckmarkCircleIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { KommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/KommentarSeksjon';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { NotathendelseObject } from '@typer/historikk';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

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
    const apolloClient = useApolloClient();

    const { mutate, isPending: loading, error } = usePatchNotat();

    function feilregistrerNotat() {
        mutate(
            {
                notatId: parseInt(id),
                data: {
                    feilregistrert: true,
                },
            },
            {
                onSuccess: async () => {
                    apolloClient.cache.modify({
                        id: apolloClient.cache.identify({ __typename: 'Notat', id: parseInt(id) }),
                        fields: {
                            feilregistrert() {
                                return true;
                            },
                            feilregistert_tidspunkt() {
                                return dayjs().format(ISO_TIDSPUNKTFORMAT) ?? '';
                            },
                        },
                    });
                },
            },
        );
    }

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
                                size="xsmall"
                                variant="tertiary"
                                loading={loading}
                                icon={<MenuElipsisHorizontalIcon title="Handlinger" />}
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
            <VStack gap="space-0">
                {førsteTekstlinje}
                {øvrigeTekstlinjer !== '' && (
                    <Expandable>
                        <BodyShortWithPreWrap>{øvrigeTekstlinjer}</BodyShortWithPreWrap>
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
