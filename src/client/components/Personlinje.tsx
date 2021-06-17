import styled from '@emotion/styled';
import { Person } from 'internal-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { Element, Normaltekst } from 'nav-frontend-typografi';

import { usePersondataSkalAnonymiseres } from '../state/person';
import { NORSK_DATOFORMAT } from '../utils/date';
import { capitalizeName } from '../utils/locale';

import { anonymisertPersoninfo } from '../agurkdata';
import { utbetalingsoversikt } from '../featureToggles';
import { Clipboard } from './clipboard';
import { KjønnsnøytraltIkon } from './ikoner/KjønnsnøytraltIkon';
import { Kvinneikon } from './ikoner/Kvinneikon';
import { Manneikon } from './ikoner/Manneikon';

const formatFnr = (fnr: string) => fnr.slice(0, 6) + ' ' + fnr.slice(6);

const Container = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 48px;
    min-width: var(--speil-total-min-width);
    box-sizing: border-box;
    padding: 0 2rem;
    background: var(--speil-background-secondary);
    border-bottom: 1px solid var(--navds-color-border);
    color: var(--navds-color-text-primary);

    > svg {
        margin-right: 0.5rem;
    }
`;

const Separator = styled(Normaltekst)`
    margin: 0 1rem 0 1rem;
`;

const Lenke = styled(Link)`
    color: inherit;

    &:hover {
        text-decoration: none;
    }

    &:active,
    &:focus-visible {
        outline: none;
        color: var(--navds-color-text-inverse);
        text-decoration: none;
        background-color: var(--navds-text-focus);
        box-shadow: 0 0 0 2px var(--navds-text-focus);
    }
`;

const Etikett = styled.div`
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    width: max-content;
`;

const DødsdatoEtikett = styled(Etikett)`
    background: var(--speil-etikett-forlengelse-it-background);
    border: 1px solid var(--speil-etikett-forlengelse-it-border);
    color: var(--navds-color-text-inverse);
`;

const Kjønnsikon = ({ kjønn }: { kjønn: 'kvinne' | 'mann' | 'ukjent' }) => {
    switch (kjønn.toLowerCase()) {
        case 'kvinne':
            return <Kvinneikon />;
        case 'mann':
            return <Manneikon />;
        default:
            return <KjønnsnøytraltIkon />;
    }
};

interface PersonlinjeProps {
    person?: Person;
}

const LoadingText = styled.div`
    @keyframes placeHolderShimmer {
        0% {
            background-position: -468px 0;
        }
        100% {
            background-position: 468px 0;
        }
    }

    animation-duration: 1.25s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: transparent;
    background: linear-gradient(to right, transparent 0%, #eaeaea 16%, transparent 33%);
    background-size: 800px 104px;
    border-radius: 4px;
    height: 22px;
    width: 150px;
    margin: 4px 0;
`;

export const LasterPersonlinje = () => (
    <Container>
        <KjønnsnøytraltIkon />
        <LoadingText />
        <Separator>/</Separator>
        <LoadingText />
        <Separator>/</Separator>
        <LoadingText />
        <Separator>/</Separator>
        <LoadingText />
        <Separator>/</Separator>
        <LoadingText />
    </Container>
);

export const Personlinje = ({ person }: PersonlinjeProps) => {
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    if (!person) return <Container />;

    const { aktørId, personinfo, enhet } = anonymiseringEnabled
        ? { ...person, aktørId: '1000000000000', enhet: { id: 1000, navn: 'Agurkheim' } }
        : person;
    const { fornavn, mellomnavn, etternavn, kjønn, fnr } = anonymiseringEnabled ? anonymisertPersoninfo : personinfo;

    return (
        <Container>
            <Kjønnsikon kjønn={kjønn} />
            <Element>{capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''}`)}</Element>
            <Separator>/</Separator>
            {fnr ? (
                <Clipboard preserveWhitespace={false} copyMessage="Fødselsnummer er kopiert">
                    <Normaltekst>{formatFnr(fnr)}</Normaltekst>
                </Clipboard>
            ) : (
                <Normaltekst>Fødselsnummer ikke tilgjengelig</Normaltekst>
            )}
            <Separator>/</Separator>
            <Normaltekst>Aktør-ID:&nbsp;</Normaltekst>
            <Clipboard preserveWhitespace={false} copyMessage="Aktør-ID er kopiert">
                <Normaltekst>{aktørId}</Normaltekst>
            </Clipboard>
            <Separator>/</Separator>
            <Normaltekst>
                Boenhet: {enhet.id} ({enhet.navn})
            </Normaltekst>
            {utbetalingsoversikt && (
                <>
                    <Separator>/</Separator>
                    <Lenke to={`${person.aktørId}/../utbetalingshistorikk`}>Utbetalingsoversikt</Lenke>
                </>
            )}
            {person?.dødsdato && (
                <>
                    <Separator>/</Separator>
                    <DødsdatoEtikett>Død {person?.dødsdato?.format(NORSK_DATOFORMAT)}</DødsdatoEtikett>
                </>
            )}
        </Container>
    );
};
