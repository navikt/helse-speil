import React, { ReactElement, useState } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, ErrorMessage, VStack } from '@navikt/ds-react';

import { BodyShortWithPreWrap } from '@components/BodyShortWithPreWrap';
import { getGetNotaterForVedtaksperiodeQueryKey, usePatchNotat } from '@io/rest/generated/notater/notater';
import { Expandable } from '@saksbilde/historikk/komponenter/Expandable';
import { HistorikkChatIkon, HistorikkCheckmarkCircleIkon } from '@saksbilde/historikk/komponenter/HendelseIkon';
import { Historikkhendelse } from '@saksbilde/historikk/komponenter/Historikkhendelse';
import { NotatKommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/notat/NotatKommentarSeksjon';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useQueryClient } from '@tanstack/react-query';
import { NotathendelseObject } from '@typer/historikk';

type NotathendelseProps = {
    hendelse: NotathendelseObject;
};

export const Notathendelse = ({
    hendelse: {
        id,
        dialogRef,
        tekst,
        erOpphevStans,
        saksbehandler,
        timestamp,
        feilregistrert,
        kommentarer,
        vedtaksperiodeId,
    },
}: NotathendelseProps): ReactElement => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const { feilregistrerNotat, loading, error } = useFeilregistrerNotat(vedtaksperiodeId, Number.parseInt(id));

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
                            <ActionMenu.Item onSelect={feilregistrerNotat}>Feilregistrer</ActionMenu.Item>
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
            <NotatKommentarSeksjon
                kommentarer={kommentarer}
                vedtaksperiodeId={vedtaksperiodeId}
                dialogRef={dialogRef}
            />
        </Historikkhendelse>
    );
};

function useFeilregistrerNotat(vedtaksperiodeId: string, notatId: number) {
    const [loading, setLoading] = useState<boolean>(false);
    const { mutate, error } = usePatchNotat();
    const queryClient = useQueryClient();

    function feilregistrerNotat() {
        setLoading(true);
        mutate(
            {
                notatId: notatId,
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

    return {
        feilregistrerNotat,
        loading,
        error,
    };
}

const toNotatTittel = (erOpphevStans: boolean): string => {
    if (erOpphevStans) {
        return 'Stans opphevet';
    } else {
        return 'Notat';
    }
};
