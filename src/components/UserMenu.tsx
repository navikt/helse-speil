'use client';

import { useTheme } from 'next-themes';
import React, { ReactElement, useState } from 'react';

import { ActionMenu, BodyShort, HStack, Tag, Theme, VStack } from '@navikt/ds-react';
import { InternalHeaderUserButton } from '@navikt/ds-react/InternalHeader';

import { DarkModeToggle } from '@components/DarkModeToggle';
import { TastaturModal } from '@components/TastaturModal';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { useMounted } from '@hooks/useMounted';
import { useGetBruker } from '@io/rest/generated/saksbehandlere/saksbehandlere';
import { ApiBrukerrolle, ApiTilgang } from '@io/rest/generated/spesialist.schemas';
import { useIsAnonymous, useToggleAnonymity } from '@state/anonymization';
import { useInnloggetSaksbehandler } from '@state/authentication';

const useBrukerinfo = () => {
    const { navn, ident } = useInnloggetSaksbehandler();
    return { navn, ident: ident ?? '' };
};

export const UserMenu = (): ReactElement => {
    const { navn, ident } = useBrukerinfo();
    const { resolvedTheme } = useTheme();
    const mounted = useMounted();
    const isAnonymous = useIsAnonymous();
    const toggleAnonymity = useToggleAnonymity();
    const [visTastatursnarveier, setVisTastatursnarveier] = useState(false);

    const bruker = useGetBruker();
    const harRoller = (bruker?.data?.data?.brukerroller?.length ?? 0) > 0;
    useKeyboard([
        {
            key: Key.F1,
            action: () => setVisTastatursnarveier(!visTastatursnarveier),
            ignoreIfModifiers: false,
        },
    ]);

    return (
        <>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <InternalHeaderUserButton name={navn} description={ident} />
                </ActionMenu.Trigger>
                {mounted && (
                    <Theme theme={resolvedTheme as 'light' | 'dark'}>
                        <ActionMenu.Content>
                            <VStack paddingInline="space-8">
                                <BodyShort>{navn}</BodyShort>
                                <BodyShort>{ident}</BodyShort>
                            </VStack>
                            <ActionMenu.Divider />
                            <ActionMenu.Group label="Tilgang">
                                <HStack gap="space-4" paddingInline="space-8" maxWidth="16rem">
                                    {bruker?.data?.data?.tilganger?.map((tilgang) => (
                                        <Tag size="xsmall" key={tilgang}>
                                            {tilgangVisningstekst(tilgang)}
                                        </Tag>
                                    ))}
                                </HStack>
                            </ActionMenu.Group>
                            {harRoller && (
                                <ActionMenu.Group label="Roller">
                                    <HStack gap="space-4" paddingInline="space-8" maxWidth="16rem">
                                        {sorterBrukerroller(bruker?.data?.data?.brukerroller ?? []).map((rolle) => (
                                            <Tag size="xsmall" key={rolle}>
                                                {brukerrolleVisningstekst(rolle)}
                                            </Tag>
                                        ))}
                                    </HStack>
                                </ActionMenu.Group>
                            )}
                            <ActionMenu.Divider />
                            <ActionMenu.Item onClick={toggleAnonymity}>
                                {isAnonymous ? 'Fjern anonymisering' : 'Anonymiser personopplysninger'}
                            </ActionMenu.Item>
                            <ActionMenu.Divider />
                            <ActionMenu.Item onClick={() => setVisTastatursnarveier(!visTastatursnarveier)}>
                                Tastatursnarveier
                            </ActionMenu.Item>
                            <ActionMenu.Divider />
                            <DarkModeToggle />
                            <ActionMenu.Divider />
                            <ActionMenu.Item as="a" href="/oauth2/logout">
                                Logg ut
                            </ActionMenu.Item>
                        </ActionMenu.Content>
                    </Theme>
                )}
            </ActionMenu>
            {visTastatursnarveier && (
                <TastaturModal closeModal={() => setVisTastatursnarveier(false)} showModal={visTastatursnarveier} />
            )}
        </>
    );
};

const BRUKERROLLE_REKKEFØLGE: ApiBrukerrolle[] = [
    ApiBrukerrolle.BESLUTTER,
    ApiBrukerrolle.STIKKPRØVE,
    ApiBrukerrolle.EGEN_ANSATT,
    ApiBrukerrolle.KODE_7,
    ApiBrukerrolle.SELVSTENDIG_NÆRINGSDRIVENDE_BETA,
    ApiBrukerrolle.UTVIKLER,
];

function sorterBrukerroller(roller: ApiBrukerrolle[]): ApiBrukerrolle[] {
    return [...roller].sort((a, b) => {
        const indexA = BRUKERROLLE_REKKEFØLGE.indexOf(a);
        const indexB = BRUKERROLLE_REKKEFØLGE.indexOf(b);

        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
    });
}

function brukerrolleVisningstekst(brukerrolle: ApiBrukerrolle): string {
    switch (brukerrolle) {
        case ApiBrukerrolle.SELVSTENDIG_NÆRINGSDRIVENDE_BETA:
            return 'Selvstendig næringsdrivende';
        case ApiBrukerrolle.EGEN_ANSATT:
            return 'Egen ansatt';
        case ApiBrukerrolle.STIKKPRØVE:
            return 'Stikkprøve';
        case ApiBrukerrolle.UTVIKLER:
            return 'Utvikler';
        case ApiBrukerrolle.KODE_7:
            return 'Kode 7';
        case ApiBrukerrolle.BESLUTTER:
            return 'Beslutter';
        default:
            return brukerrolle;
    }
}

function tilgangVisningstekst(tilgang: ApiTilgang): string {
    switch (tilgang) {
        case ApiTilgang.LES:
            return 'Lesetilgang';
        case ApiTilgang.SKRIV:
            return 'Skrivetilgang';
    }
}
