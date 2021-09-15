import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Element } from 'nav-frontend-typografi';

import { ExternalLink, SystemFilled } from '@navikt/ds-icons';
import { Popover } from '@navikt/ds-react';

import { usePerson } from '../state/person';

import { Button } from './Button';
import { DropdownMenyknapp } from './dropdown/Dropdown';

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

const Tittel = styled(Element)`
    color: var(--navds-color-text-primary);
    padding: 4px 16px 16px;
`;

const MenyLenke = styled(DropdownMenyknapp)`
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

const BentoLenke: React.FC<BentoLenkeProps> = ({ href, children }) => (
    <MenyLenke href={href} target="_blank">
        {children}
        <ExternalLink />
    </MenyLenke>
);

export const BentoMeny = () => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const person = usePerson();

    const links: { tekst: string; href: string }[] = [
        {
            tekst: 'A-inntekt',
            href: person
                ? `https://modapp.adeo.no/a-inntekt/person/${person.fødselsnummer}?4&soekekontekst=PERSON&modia.global.hent.person.begrunnet=false#!PersonInntektLamell`
                : 'https://modapp.adeo.no/a-inntekt/',
        },
        {
            tekst: 'Aa-registeret',
            href: person
                ? `https://modapp.adeo.no/aareg-web/?2&rolle=arbeidstaker&ident=${person.fødselsnummer}#!arbeidsforhold`
                : 'https://modapp.adeo.no/aareg-web/?2&rolle=arbeidstaker',
        },
        {
            tekst: 'Gosys',
            href: person
                ? `https://gosys.intern.nav.no/gosys/personoversikt/fnr=${person.fødselsnummer}`
                : 'https://gosys.intern.nav.no/gosys/',
        },
        {
            tekst: 'Modia Personoversikt',
            href: person
                ? `https://app.adeo.no/modiapersonoversikt/person/${person.fødselsnummer}`
                : 'https://app.adeo.no/modiapersonoversikt',
        },
        {
            tekst: 'Modia Sykefraværsoppfølging',
            href: `https://syfomodiaperson.intern.nav.no/sykefravaer/${person ? person.fødselsnummer : ''}`,
        },
        { tekst: 'Oppdrag', href: 'https://wasapp.adeo.no/oppdrag/venteregister/details.htm' },
        { tekst: 'Folketrygdloven kapittel 8', href: 'https://lovdata.no/nav/folketrygdloven/kap8' },
        { tekst: 'Brønnøysundregisteret', href: 'https://brreg.no' },
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
                <Tittel>Systemer og oppslagsverk</Tittel>
                {links.map(({ tekst, href }) => (
                    <BentoLenke key={href} href={href}>
                        {tekst}
                    </BentoLenke>
                ))}
            </Popover>
        </Container>
    );
};
