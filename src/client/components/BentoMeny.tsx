import styled from '@emotion/styled';
import Lenke from 'nav-frontend-lenker';
import Popover from 'nav-frontend-popover';
import { PopoverOrientering } from 'nav-frontend-popover';
import React from 'react';
import { useState } from 'react';
import { Button } from './Button';
import { ExternalLink, SystemFilled } from '@navikt/ds-icons';

const BentoMenyContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-self: stretch;
    align-items: center;
    border-left: 1px solid var(--navds-color-gray-40);
`;

const BentoButton = styled(Button)`
    color: inherit;
    font-size: 1.25rem;
    display: flex;
    padding: 0 0.825rem;
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
                    <BentoLenke href="https://modapp.adeo.no/a-inntekt/" tekst="AInntekt" />
                    <BentoLenke href="https://modapp.adeo.no/aareg-web/" tekst="A-registeret" />
                    <BentoLenke href="https://gosys-nais.nais.adeo.no/gosys/bruker/brukeroversikt.jsf" tekst="GoSys" />
                    <BentoLenke
                        href="https://gosys-nais.nais.adeo.no/gosys/person/personhistorikk.jsf"
                        tekst="Personhistorikk"
                    />
                    <BentoLenke href="https://app.adeo.no/modiapersonoversikt/" tekst="Modia Personoversikt" />
                    <BentoLenke
                        href="https://syfomodiaperson.nais.adeo.no/sykefravaer/"
                        tekst="Modia Sykefraværsoppfølging"
                    />
                    <BentoLenke href="https://lovdata.no/nav/folketrygdloven/kap8" tekst="Folketrygdloven kapittel 8" />
                </div>
            </Popover>
        </BentoMenyContainer>
    );
};
