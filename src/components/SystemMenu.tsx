'use client';

import { useTheme } from 'next-themes';
import React, { ReactElement } from 'react';

import { ExternalLinkIcon, MenuGridIcon } from '@navikt/aksel-icons';
import { ActionMenu, InternalHeader, Theme } from '@navikt/ds-react';

import { useMounted } from '@hooks/useMounted';
import { useFetchPersonQuery } from '@state/person';

export const redirigerTilArbeidOgInntektUrl = async (url: string, fødselsnummer: string | null) => {
    if (!fødselsnummer) {
        window.open('https://arbeid-og-inntekt.nais.adeo.no');
        return;
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Nav-Personident': fødselsnummer,
                'Nav-Enhet': '4488',
                'Nav-A-inntekt-Filter': '8-28Sykepenger',
            },
        });
        const data = await response.text();
        window.open(data);
    } catch {
        window.open('https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/error');
    }
};

const settModiaContext = async (fødselsnummer: string) => {
    const response = await fetch(`/api/modia/velgBruker`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            verdi: fødselsnummer,
            eventType: 'NY_AKTIV_BRUKER',
        }),
    });
    if (!response.ok) throw Error('Setting av context feilet');
};
const nullstillModiaContext = async () => {
    const response = await fetch(`/api/modia/aktivBruker`, { method: 'DELETE' });
    if (!response.ok) throw Error('Nullstilling av context feilet');
};

export const hoppTilModia = async (url: string, fødselsnummer: string | null) => {
    const forbered = () => (fødselsnummer ? settModiaContext(fødselsnummer) : nullstillModiaContext());
    try {
        await forbered();
    } catch (_) {
        const tekst = fødselsnummer
            ? 'Søk av person i Modia feilet, du må søke den opp manuelt når du kommer til Modia.'
            : 'Forrige person kan fortsatt være valgt når du kommer til Modia.';
        const fortsett = confirm(`${tekst}\n\nTrykk på OK for fortsette til Modia.`);
        if (!fortsett) return;
    }
    window.open(url);
};

type CommonLinkProps = { tekst: string; snarveibokstav: string };
type ButtonLink = CommonLinkProps & { action: () => void };
type HrefLink = CommonLinkProps & { href: string };

const createLinks = (maybeFnr: string | null, maybeAktoerId: string | null): (HrefLink | ButtonLink)[] => [
    {
        tekst: 'A-inntekt',
        action: () =>
            redirigerTilArbeidOgInntektUrl(
                'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/a-inntekt',
                maybeFnr,
            ),
        snarveibokstav: 'E',
    },
    {
        tekst: 'Aa-registeret',
        action: () =>
            redirigerTilArbeidOgInntektUrl(
                'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/arbeidstaker',
                maybeFnr,
            ),
        snarveibokstav: 'A',
    },
    {
        tekst: 'Gosys',
        href: maybeFnr
            ? `https://gosys.intern.nav.no/gosys/personoversikt/fnr=${maybeFnr}`
            : 'https://gosys.intern.nav.no/gosys/',
        snarveibokstav: 'G',
    },
    {
        tekst: 'Modia Sykefraværsoppfølging',
        action: () => hoppTilModia(`https://syfomodiaperson.intern.nav.no/sykefravaer/`, maybeFnr),
        snarveibokstav: 'S',
    },
    {
        tekst: 'Modia Personoversikt',
        href: maybeFnr
            ? `https://app.adeo.no/modiapersonoversikt/person/${maybeFnr}`
            : 'https://app.adeo.no/modiapersonoversikt',
        snarveibokstav: 'M',
    },
    {
        tekst: 'Oppdrag',
        href: 'https://wasapp.adeo.no/oppdrag/venteregister/details.htm',
        snarveibokstav: 'O',
    },
    {
        tekst: 'Foreldrepenger',
        href: maybeAktoerId ? `https://fpsak.intern.nav.no/aktoer/${maybeAktoerId}` : 'https://fpsak.intern.nav.no',
        snarveibokstav: 'F',
    },
    {
        tekst: 'Folketrygdloven kapittel 8',
        href: 'https://lovdata.no/pro/#document/NL/lov/1997-02-28-19/KAPITTEL_4-4',
        snarveibokstav: 'L',
    },
    { tekst: 'Brønnøysundregisteret', href: 'https://brreg.no', snarveibokstav: 'B' },
    {
        tekst: 'Rutiner for sykepenger',
        href: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Samhandlings--og-samordningsrutiner.aspx',
        snarveibokstav: 'R',
    },
    {
        tekst: 'Demosider for vedtak',
        action: () => hoppTilModia(`https://demo.ekstern.dev.nav.no/syk/sykepenger`, maybeFnr),
        snarveibokstav: 'D',
    },
];

export const SystemMenu = (): ReactElement => {
    const { resolvedTheme } = useTheme();
    const mounted = useMounted();

    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <InternalHeader.Button aria-label="Systemmeny">
                    <MenuGridIcon title="Systemmeny" fontSize="2.25rem" />
                </InternalHeader.Button>
            </ActionMenu.Trigger>
            {mounted && (
                <Theme theme={resolvedTheme as 'light' | 'dark'}>
                    <ActionMenu.Content>
                        <ActionMenu.Group label="Systemer og oppslagsverk">
                            <SystemMenuLinks />
                        </ActionMenu.Group>
                    </ActionMenu.Content>
                </Theme>
            )}
        </ActionMenu>
    );
};

function SystemMenuLinks(): ReactElement[] {
    const { data } = useFetchPersonQuery();
    const maybeFnr: string | null = data?.person?.fodselsnummer ?? null;
    const maybeAktoerId: string | null = data?.person?.aktorId ?? null;

    return createLinks(maybeFnr, maybeAktoerId).map((link) =>
        'href' in link ? (
            <ActionMenu.Item
                key={link.tekst}
                as="a"
                href={link.href}
                target="_blank"
                shortcut={`⇧+${link.snarveibokstav}`}
                icon={<ExternalLinkIcon aria-hidden />}
            >
                {link.tekst}
            </ActionMenu.Item>
        ) : (
            <ActionMenu.Item
                key={link.tekst}
                onSelect={link.action}
                shortcut={`⇧+${link.snarveibokstav}`}
                icon={<ExternalLinkIcon aria-hidden />}
            >
                {link.tekst}
            </ActionMenu.Item>
        ),
    );
}
