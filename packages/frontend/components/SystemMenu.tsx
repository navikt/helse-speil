import React from 'react';

import { ExternalLink, System } from '@navikt/ds-icons';
import { Dropdown, Header } from '@navikt/ds-react-internal';

import { useCurrentPerson } from '@state/person';

import styles from './SystemMenu.module.css';

export const redirigerTilArbeidOgInntektUrl = (url: string, fødselsnummer: string) => {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Nav-Personident': fødselsnummer,
            'Nav-Enhet': '4488',
            'Nav-A-inntekt-Filter': '8-28Sykepenger',
        },
    })
        .then((response) => response.text())
        .then((data) => window.open(data))
        .catch(() => window.open('https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/error'));
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
        {
            tekst: 'Modia Sykefraværsoppfølging',
            href: `https://syfomodiaperson.intern.nav.no/sykefravaer/${person ? person.fodselsnummer : ''}`,
            snarveibokstav: 'S',
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
                            as="a"
                            href="https://arbeid-og-inntekt.nais.adeo.no"
                            target="_blank"
                            className={styles.ExternalLink}
                            onClick={(event) => {
                                if (person) {
                                    event.preventDefault();
                                    redirigerTilArbeidOgInntektUrl(url, person.fodselsnummer);
                                }
                            }}
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
