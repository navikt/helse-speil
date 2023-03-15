import React from 'react';

import { ExternalLink, System } from '@navikt/ds-icons';
import { Dropdown, Header } from '@navikt/ds-react-internal';

import { useCurrentPerson } from '@state/person';

import styles from './SystemMenu.module.css';

const redirigerTilArbeidOgInntektUrl = (url: string, fødselsnummer: string) => {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Nav-Personident': fødselsnummer,
        },
    })
        .then((response) => response.text())
        .then((data) => window.open(data))
        .catch(() => window.open('https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/error'));
};

export const SystemMenuContent = () => {
    const person = useCurrentPerson();

    const arbeidOgInntektLinks: Array<{ tekst: string; url: string }> = [
        {
            tekst: 'A-inntekt',
            url: 'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/a-inntekt',
        },
        {
            tekst: 'Aa-registeret',
            url: 'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/arbeidstaker',
        },
    ];

    const links: Array<{ tekst: string; href: string }> = [
        {
            tekst: 'Gosys',
            href: person
                ? `https://gosys.intern.nav.no/gosys/personoversikt/fnr=${person.fodselsnummer}`
                : 'https://gosys.intern.nav.no/gosys/',
        },
        {
            tekst: 'Modia Personoversikt',
            href: person
                ? `https://app.adeo.no/modiapersonoversikt/person/${person.fodselsnummer}`
                : 'https://app.adeo.no/modiapersonoversikt',
        },
        {
            tekst: 'Modia Sykefraværsoppfølging',
            href: `https://syfomodiaperson.intern.nav.no/sykefravaer/${person ? person.fodselsnummer : ''}`,
        },
        { tekst: 'Oppdrag', href: 'https://wasapp.adeo.no/oppdrag/venteregister/details.htm' },
        { tekst: 'Folketrygdloven kapittel 8', href: 'https://lovdata.no/nav/folketrygdloven/kap8' },
        { tekst: 'Brønnøysundregisteret', href: 'https://brreg.no' },
        {
            tekst: 'Rutiner for sykepenger',
            href: 'https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Samhandlings--og-samordningsrutiner.aspx',
        },
    ];

    return (
        <Dropdown>
            <Header.Button as={Dropdown.Toggle} aria-label="Toggle dropdown">
                <System className={styles.SystemIcon} />
            </Header.Button>
            <Dropdown.Menu className={styles.DropdownContent}>
                <Dropdown.Menu.GroupedList>
                    <Dropdown.Menu.GroupedList.Heading>Systemer og oppslagsverk</Dropdown.Menu.GroupedList.Heading>
                    {arbeidOgInntektLinks.map(({ tekst, url }) => (
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
                        </Dropdown.Menu.GroupedList.Item>
                    ))}
                    {links.map(({ tekst, href }) => (
                        <Dropdown.Menu.GroupedList.Item
                            key={href}
                            as="a"
                            href={href}
                            target="_blank"
                            className={styles.ExternalLink}
                        >
                            {tekst}
                            <ExternalLink />
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
