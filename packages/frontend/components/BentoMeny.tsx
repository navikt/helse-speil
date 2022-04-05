import styled from '@emotion/styled';
import React, { useState } from 'react';

import { ExternalLink, SystemFilled } from '@navikt/ds-icons';
import { BodyShort, Popover } from '@navikt/ds-react';

import { Button } from './Button';
import { DropdownButton } from './dropdown/Dropdown';
import { useCurrentPerson } from '@state/person';
import { Person } from '@io/graphql';

const Container = styled.div`
    display: flex;
    justify-content: flex-end;
    align-self: stretch;
    align-items: center;
    border-left: 1px solid var(--navds-color-gray-40);
    border-right: 1px solid var(--navds-color-gray-40);

    > .navds-popover {
        padding: 16px 0;
        border-radius: 4px;
        z-index: 1001;

        &:focus,
        &:focus-visible {
            box-shadow: 0 0.05rem 0.25rem 0.125rem rgb(0 0 0 / 8%);
            border-color: var(--navds-text-focus);
        }
    }
`;

const BentoButton = styled(Button)`
    color: inherit;
    font-size: 1.25rem;
    display: flex;
    padding: 0 0.825rem;
    align-self: stretch;
    align-items: center;

    &:focus-visible {
        box-shadow: inset var(--navds-shadow-focus-on-dark);
    }
`;

const Tittel = styled(BodyShort)`
    color: var(--navds-color-text-primary);
    font-weight: 600;
    padding: 4px 16px 16px;
`;

const MenyLenke = styled(DropdownButton)`
    display: flex;
    align-items: center;
    color: var(--navds-color-text-link);

    > svg,
    &:focus > svg {
        margin-left: 12px;
        color: var(--navds-color-darkgray);
        stroke: none;
    }

    &:hover,
    &:focus {
        color: var(--navds-color-text-primary);
    }
`.withComponent('a');

interface BentoLenkeProps {
    href: string;
}

interface ArbeidOgInntektRedirectLenkeProps {
    url: string;
    person?: Maybe<Person>;
}

const BentoLenke: React.FC<BentoLenkeProps> = ({ href, children }) => (
    <MenyLenke href={href} target="_blank">
        {children}
        <ExternalLink />
    </MenyLenke>
);

const ArbeidOgInntektRedirigerLenke: React.FC<ArbeidOgInntektRedirectLenkeProps> = ({ url, person, children }) =>
    person ? (
        <MenyLenke onClick={() => redirigerTilArbeidOgInntektUrl(url, person.fodselsnummer)}>
            {children}
            <ExternalLink />
        </MenyLenke>
    ) : (
        <MenyLenke href="https://arbeid-og-inntekt.nais.adeo.no" target="_blank">
            {children}
            <ExternalLink />
        </MenyLenke>
    );

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

export const BentoMenyContent = () => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const person = useCurrentPerson();

    const arbeidOgInntektLinks: { tekst: string; url: string }[] = [
        {
            tekst: 'A-inntekt',
            url: 'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/a-inntekt',
        },
        {
            tekst: 'Aa-registeret',
            url: 'https://arbeid-og-inntekt.nais.adeo.no/api/v2/redirect/sok/arbeidstaker',
        },
    ];

    const links: { tekst: string; href: string }[] = [
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
        <Container>
            <BentoButton onClick={(e) => (anchor ? setAnchor(null) : setAnchor(e.currentTarget))}>
                <SystemFilled />
            </BentoButton>
            <Popover
                open={anchor !== null}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                placement="bottom"
                arrow={false}
                offset={-8}
                tabIndex={-1}
            >
                <Tittel as="p">Systemer og oppslagsverk</Tittel>
                {arbeidOgInntektLinks.map(({ tekst, url }) => (
                    <ArbeidOgInntektRedirigerLenke key={url} url={url} person={person}>
                        {tekst}
                    </ArbeidOgInntektRedirigerLenke>
                ))}
                {links.map(({ tekst, href }) => (
                    <BentoLenke key={href} href={href}>
                        {tekst}
                    </BentoLenke>
                ))}
            </Popover>
        </Container>
    );
};

export const BentoMeny: React.VFC = () => {
    return (
        <React.Suspense fallback={null}>
            <BentoMenyContent />
        </React.Suspense>
    );
};
