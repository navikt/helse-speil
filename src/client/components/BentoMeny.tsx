import styled from '@emotion/styled';
import Lenke from 'nav-frontend-lenker';
import Popover from 'nav-frontend-popover';
import { PopoverOrientering } from 'nav-frontend-popover';
import React from 'react';
import { useState } from 'react';
import { Button } from './Button';
import { ExternalLink, SystemFilled } from '@navikt/ds-icons';
import { usePerson } from '../state/person';

const BentoMenyContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-self: stretch;
    align-items: center;
    border-left: 1px solid var(--navds-color-gray-40);
    border-right: 1px solid var(--navds-color-gray-40);
`;

const BentoButton = styled(Button)`
    color: inherit;
    font-size: 1.25rem;
    display: flex;
    padding: 0 0.825rem;
    align-self: stretch;
    align-items: center;
`;

const StyledLenke = styled(Lenke)`
    display: flex;
    padding: 0.7rem 1rem;

    &:hover {
        background: var(--speil-light-hover);
    }
`;

interface BentoLenkeProps {
    href: string;
    tekst: string;
}

const BentoLenke = ({ href, tekst }: BentoLenkeProps) => (
    <StyledLenke href={href} target={'_blank'}>
        {tekst}
        <ExternalLink style={{ marginLeft: '1rem' }} />
    </StyledLenke>
);

export const BentoMeny = () => {
    const [anchor, setAnchor] = useState<HTMLElement | undefined>(undefined);
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
                ? `https://gosys-nais.nais.adeo.no/gosys/personoversikt/fnr=${person.fødselsnummer}`
                : 'https://gosys-nais.nais.adeo.no/gosys/',
        },
        {
            tekst: 'Modia Personoversikt',
            href: person
                ? `https://app.adeo.no/modiapersonoversikt/person/${person.fødselsnummer}`
                : 'https://app.adeo.no/modiapersonoversikt',
        },
        {
            tekst: 'Modia Sykefraværsoppfølging',
            href: `https://syfomodiaperson.nais.adeo.no/sykefravaer/${person ? person.fødselsnummer : ''}`,
        },
        {
            tekst: 'Arena',
            href: person
                ? `http://arena.adeo.no/forms/arenaMod.html?oppstart_skj=AS_REGPERSONALIA&fodselsnr=${person.fødselsnummer}`
                : 'http://arena.adeo.no/forms/frmservlet?config=arena',
        },
        { tekst: 'Folketrygdloven kapittel 8', href: 'https://lovdata.no/nav/folketrygdloven/kap8' },
    ];

    return (
        <BentoMenyContainer>
            <BentoButton onClick={(e) => (anchor ? setAnchor(undefined) : setAnchor(e.currentTarget))}>
                <SystemFilled />
            </BentoButton>
            <Popover
                ankerEl={anchor}
                onRequestClose={() => setAnchor(undefined)}
                orientering={PopoverOrientering.Under}
                tabIndex={-1}
            >
                <div>
                    {links.map((link) => (
                        <BentoLenke href={link.href} tekst={link.tekst} key={link.href} />
                    ))}
                </div>
            </Popover>
        </BentoMenyContainer>
    );
};
