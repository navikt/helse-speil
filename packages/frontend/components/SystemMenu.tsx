import React from 'react';

import { ExternalLink, System } from '@navikt/ds-icons';
import { Dropdown, Header } from '@navikt/ds-react-internal';

import { useCurrentPerson } from '@state/person';

import { BASE_URL } from '../constants';

import styles from './SystemMenu.module.css';

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
    const response = await fetch(`${BASE_URL}/settModiaContext`, {
        method: 'post',
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
    const response = await fetch(`${BASE_URL}/settModiaContext/aktivbruker`, { method: 'delete' });
    if (!response.ok) throw Error('Nullstilling av context feilet');
};

export const hoppTilModia = async (url: string, fødselsnummer: string | null) => {
    const forbered = () => (fødselsnummer ? settModiaContext(fødselsnummer) : nullstillModiaContext());
    try {
        await forbered();
    } catch (error) {
        const tekst = fødselsnummer
            ? 'Søk av person i Modia feilet, du må søke den opp manuelt når du kommer til Modia.'
            : 'Forrige person kan fortsatt være valgt når du kommer til Modia.';
        const fortsett = confirm(`${tekst}\n\nTrykk på OK for fortsette til Modia.`);
        if (!fortsett) return;
    }
    window.open(url);
};

export const SystemMenuContent = () => {
    const person = useCurrentPerson();

    const arbeidOgInntektLinks: Array<{ tekst: string; url: string; snarveibokstav: string }> = [
        {
            tekst: 'A-inntekt',
            url: 'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/a-inntekt',
            snarveibokstav: 'E',
        },
        {
            tekst: 'Aa-registeret',
            url: 'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/arbeidstaker',
            snarveibokstav: 'A',
        },
    ];

    const modiaLinks: Array<{ tekst: string; url: string; snarveibokstav: string }> = [
        {
            tekst: 'Modia Sykefraværsoppfølging',
            url: `https://syfomodiaperson.intern.nav.no/sykefravaer/`,
            snarveibokstav: 'S',
        },
    ];

    const links: Array<{ tekst: string; href: string; snarveibokstav: string }> = [
        {
            tekst: 'Gosys',
            href: person
                ? `https://gosys.intern.nav.no/gosys/personoversikt/fnr=${person.fodselsnummer}`
                : 'https://gosys.intern.nav.no/gosys/',
            snarveibokstav: 'G',
        },
        {
            tekst: 'Modia Personoversikt',
            href: person
                ? `https://app.adeo.no/modiapersonoversikt/person/${person.fodselsnummer}`
                : 'https://app.adeo.no/modiapersonoversikt',
            snarveibokstav: 'M',
        },
        { tekst: 'Oppdrag', href: 'https://wasapp.adeo.no/oppdrag/venteregister/details.htm', snarveibokstav: 'O' },
        {
            tekst: 'Folketrygdloven kapittel 8',
            href: 'https://lovdata.no/nav/folketrygdloven/kap8',
            snarveibokstav: 'L',
        },
        { tekst: 'Brønnøysundregisteret', href: 'https://brreg.no', snarveibokstav: 'B' },
        {
            tekst: 'Rutiner for sykepenger',
            href: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Samhandlings--og-samordningsrutiner.aspx',
            snarveibokstav: 'R',
        },
    ];

    return (
        <Dropdown>
            <Header.Button as={Dropdown.Toggle} aria-label="Toggle dropdown">
                <System className={styles.SystemIcon} title="Toggle dropdown" />
            </Header.Button>
            <Dropdown.Menu className={styles.DropdownContent}>
                <Dropdown.Menu.GroupedList>
                    <Dropdown.Menu.GroupedList.Heading>Systemer og oppslagsverk</Dropdown.Menu.GroupedList.Heading>
                    {arbeidOgInntektLinks.map(({ tekst, url, snarveibokstav }) => (
                        <Dropdown.Menu.GroupedList.Item
                            key={url}
                            as="button"
                            className={styles.ExternalLink}
                            onClick={() => void redirigerTilArbeidOgInntektUrl(url, person?.fodselsnummer)}
                        >
                            {tekst}
                            <ExternalLink />
                            <span className={styles.snarvei}>
                                <span className={styles.tast}>⇧</span>
                                <span className={styles.tast}>{snarveibokstav}</span>
                            </span>
                        </Dropdown.Menu.GroupedList.Item>
                    ))}
                    {modiaLinks.map(({ tekst, url, snarveibokstav }) => (
                        <Dropdown.Menu.GroupedList.Item
                            key={url}
                            as="button"
                            className={styles.ExternalLink}
                            onClick={() => void hoppTilModia(url, person?.fodselsnummer)}
                        >
                            {tekst}
                            <ExternalLink />
                            <span className={styles.snarvei}>
                                <span className={styles.tast}>⇧</span>
                                <span className={styles.tast}>{snarveibokstav}</span>
                            </span>
                        </Dropdown.Menu.GroupedList.Item>
                    ))}
                    {links.map(({ tekst, href, snarveibokstav }) => (
                        <Dropdown.Menu.GroupedList.Item
                            key={href}
                            as="a"
                            href={href}
                            target="_blank"
                            className={styles.ExternalLink}
                        >
                            {tekst}
                            <ExternalLink />
                            <span className={styles.snarvei}>
                                <span className={styles.tast}>⇧</span>
                                <span className={styles.tast}>{snarveibokstav}</span>
                            </span>
                        </Dropdown.Menu.GroupedList.Item>
                    ))}
                </Dropdown.Menu.GroupedList>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export const SystemMenu: React.FC = () => {
    return (
        <React.Suspense fallback={null}>
            <SystemMenuContent />
        </React.Suspense>
    );
};
