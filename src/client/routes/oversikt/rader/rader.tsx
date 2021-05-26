import styled from '@emotion/styled';
import { Oppgave } from 'internal-types';
import React from 'react';
import { Link } from 'react-router-dom';

import '@navikt/helse-frontend-meatball/lib/main.css';
import { Tabellrad } from '@navikt/helse-frontend-tabell';

import { useRemoveAlleVarsler } from '../../../state/varsler';

import { Bosted } from './Bosted';
import { Inntektskildetype } from './Inntektskildetype';
import { Kjøttbolle } from './Kjøttbolle';
import { Opprettet } from './Opprettet';
import { Sakstype } from './Sakstype';
import { Status } from './Status';
import { Søker } from './Søker';
import { Tildeling } from './Tildeling';

export const tooltipId = (kolonne: string, oppgave: Oppgave): string =>
    `tabellrad-${kolonne}-tooltip-${oppgave.oppgavereferanse}`;

export const CellContainer = styled.div<{ width?: number }>`
    position: relative;
    height: 2rem;
    display: flex;
    align-items: center;

    ${({ width }) =>
        width &&
        `
        width: ${width}px;
        max-width: ${width}px;
    `}
`;

const SkjultLenke = styled(Link)`
    position: absolute;
    width: 100%;
    height: 100%;
    margin-left: -1rem;
    padding: 0 1.5rem 0 1rem;
    outline: none;
`;

export const SkjultSakslenke: React.FunctionComponent<{ oppgave: Oppgave }> = ({ oppgave }) => {
    const removeAlleVarsler = useRemoveAlleVarsler();

    const onNavigate = () => {
        removeAlleVarsler();
    };

    return (
        <SkjultLenke
            className="lenke-skjult"
            to={`/person/${oppgave.aktørId}/utbetaling`}
            onClick={onNavigate}
            tabIndex={-1}
        />
    );
};

type TabellradMedOppgave = Tabellrad & {
    oppgave: Oppgave;
};

export const tilOversiktsrad = (oppgave: Oppgave): TabellradMedOppgave => ({
    celler: [
        oppgave,
        oppgave.periodetype,
        oppgave.boenhet.navn,
        oppgave.inntektskilde,
        oppgave.antallVarsler,
        oppgave,
        oppgave.opprettet,
    ],
    oppgave,
    id: oppgave.oppgavereferanse,
});

export const renderer = (rad: Tabellrad): Tabellrad => {
    let oppgave = (rad as TabellradMedOppgave).oppgave;
    return {
        ...rad,
        celler: [
            <Tildeling oppgave={oppgave} />,
            <Sakstype oppgave={oppgave} />,
            <Bosted oppgave={oppgave} />,
            <Inntektskildetype oppgave={oppgave} />,
            <Status oppgave={oppgave} />,
            <Søker oppgave={oppgave} />,
            <Opprettet oppgave={oppgave} />,
            <Kjøttbolle oppgave={oppgave} />,
        ],
    };
};
