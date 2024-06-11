import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ExternalLink, System } from '@navikt/ds-icons';
import { Dropdown, InternalHeader as Header } from '@navikt/ds-react';

import { useFetchPersonQuery } from '@person/query';

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
    const response = await fetch(`/api/modia/velgBruker`, {
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
    const response = await fetch(`/api/modia/aktivBruker`, { method: 'delete' });
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

type CommonLinkProps = { tekst: string; snarveibokstav: string };
type ButtonLink = CommonLinkProps & { action: () => void };
type HrefLink = CommonLinkProps & { href: string };

const Link: React.FC<HrefLink> = ({ tekst, href, snarveibokstav }) => (
    <Dropdown.Menu.GroupedList.Item key={tekst} as="a" href={href} target="_blank" className={styles.ExternalLink}>
        <Lenkeinnhold tekst={tekst} snarveibokstav={snarveibokstav} />
    </Dropdown.Menu.GroupedList.Item>
);

const Button: React.FC<ButtonLink> = ({ tekst, action, snarveibokstav }) => (
    <Dropdown.Menu.GroupedList.Item key={tekst} as="button" className={styles.ExternalLink} onClick={action}>
        <Lenkeinnhold tekst={tekst} snarveibokstav={snarveibokstav} />
    </Dropdown.Menu.GroupedList.Item>
);

const Lenkeinnhold: React.FC<{ tekst: string; snarveibokstav: string }> = ({ tekst, snarveibokstav }) => (
    <>
        {tekst}
        <ExternalLink />
        <span className={styles.snarvei}>
            <span className={styles.tast}>⇧</span>
            <span className={styles.tast}>{snarveibokstav}</span>
        </span>
    </>
);

const createLinks = (maybeFnr: string | null): Array<HrefLink | ButtonLink> => [
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

export const SystemMenu = () => {
    const params = useParams<{ aktorId?: string }>();

    return (
        <Dropdown>
            <Header.Button as={Dropdown.Toggle} aria-label="Toggle dropdown">
                <System className={styles.SystemIcon} title="Toggle dropdown" />
            </Header.Button>
            <Dropdown.Menu className={styles.DropdownContent}>
                <Dropdown.Menu.GroupedList>
                    <Dropdown.Menu.GroupedList.Heading>Systemer og oppslagsverk</Dropdown.Menu.GroupedList.Heading>
                    {params.aktorId ? <SystemMenuForUser /> : <SystemMenuNoUser />}
                </Dropdown.Menu.GroupedList>
            </Dropdown.Menu>
        </Dropdown>
    );
};

function SystemMenuForUser() {
    const { data } = useFetchPersonQuery();
    const maybeFnr: string | null = data?.person?.fodselsnummer ?? null;

    return createLinks(maybeFnr).map((link) =>
        'href' in link ? (
            <Link key={link.tekst} tekst={link.tekst} href={link.href} snarveibokstav={link.snarveibokstav} />
        ) : (
            <Button key={link.tekst} tekst={link.tekst} action={link.action} snarveibokstav={link.snarveibokstav} />
        ),
    );
}

function SystemMenuNoUser() {
    return createLinks(null).map((link) =>
        'href' in link ? (
            <Link key={link.tekst} tekst={link.tekst} href={link.href} snarveibokstav={link.snarveibokstav} />
        ) : (
            <Button key={link.tekst} tekst={link.tekst} action={link.action} snarveibokstav={link.snarveibokstav} />
        ),
    );
}
