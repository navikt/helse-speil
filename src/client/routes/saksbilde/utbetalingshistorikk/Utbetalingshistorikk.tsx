import styled from '@emotion/styled';
import { Person, UtbetalingshistorikkUtbetaling } from 'internal-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import Element from 'nav-frontend-typografi/lib/element';

import { Tabell } from '@navikt/helse-frontend-tabell';

import { useRefreshPersonVedUrlEndring } from '../../../hooks/useRefreshPersonVedUrlEndring';
import { findEarliest, findLatest, NORSK_DATOFORMAT_KORT } from '../../../utils/date';

import { Annulleringslinje, Annulleringsmodal } from '../sakslinje/annullering/Annulleringsmodal';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
`;

const Lukknapp = styled.button`
    position: relative;
    cursor: pointer;
    height: 2rem;
    width: 15rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    font-size: 0.8em;
    text-decoration: underline;
    margin-bottom: 2rem;

    &:before,
    &:after {
        color: var(--navds-color-action-default);
        content: '';
        position: absolute;
        width: 1.25rem;
        height: 3px;
        top: 50%;
        left: 2em;
        background-color: currentColor;
    }

    &:before {
        transform: translate(-50%, -50%) rotate(-45deg);
    }

    &:after {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    &:hover,
    &:focus {
        background: var(--navds-color-action-default);
    }

    &:active {
        background: var(--navds-text-focus);
    }

    &:hover:before,
    &:focus:before,
    &:hover:after,
    &:focus:after,
    &:active:before,
    &:active:after {
        background: var(--navds-color-background);
    }
`;

interface UtbetalingshistorikkProps {
    person: Person;
}

export const Utbetalingshistorikk = ({ person }: UtbetalingshistorikkProps) => {
    let history = useHistory();
    const [tilAnnullering, setTilAnnullering] = useState<UtbetalingshistorikkUtbetaling | undefined>();
    const [annulleringerInFlight, setAnnulleringerInFlight] = useState<string[]>([]);

    useRefreshPersonVedUrlEndring();

    const lukkUtbetalingshistorikk = () => history.push(`/person/${person.aktørId}/utbetaling`);

    const annulleringErForespurt = (utbetaling: UtbetalingshistorikkUtbetaling) =>
        annulleringerInFlight.includes(utbetaling.arbeidsgiverOppdrag.fagsystemId);

    const visAnnulleringsknapp = ({ status, type }: UtbetalingshistorikkUtbetaling) =>
        status === 'UTBETALT' && type === 'UTBETALING';

    const settValgtUtbetalingSomInFlight = (utbetaling: UtbetalingshistorikkUtbetaling) => () => {
        setAnnulleringerInFlight(annulleringerInFlight.concat([utbetaling.arbeidsgiverOppdrag.fagsystemId]));
    };

    const headere = ['Fra', 'Til', 'Fagsystem-ID', 'Totalbeløp', 'Status', 'Type', 'Annuller'];

    const rader = person.utbetalinger.map((utbetaling) => {
        let utbetalingslinjer = utbetaling.arbeidsgiverOppdrag.utbetalingslinjer;
        return [
            <Element>{utbetalingslinjer[0].fom.format(NORSK_DATOFORMAT_KORT)}</Element>,
            <Element>{utbetalingslinjer[utbetalingslinjer.length - 1].tom.format(NORSK_DATOFORMAT_KORT)}</Element>,
            <Element>{utbetaling.arbeidsgiverOppdrag.fagsystemId}</Element>,
            <Element>{utbetaling.totalbeløp ? `${utbetaling.totalbeløp} kr` : '-'}</Element>,
            <Element>{utbetaling.status}</Element>,
            <Element>{utbetaling.type}</Element>,
            annulleringErForespurt(utbetaling) ? (
                'Utbetalingen er forespurt annullert'
            ) : visAnnulleringsknapp(utbetaling) ? (
                <button onClick={() => setTilAnnullering(utbetaling)}>Annuller</button>
            ) : null,
        ];
    });

    const linjer = (utbetaling: UtbetalingshistorikkUtbetaling): Annulleringslinje[] => [
        {
            fom: utbetaling && findEarliest(utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.map((l) => l.fom)),
            tom: utbetaling && findLatest(utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.map((l) => l.tom)),
        },
    ];

    return (
        <Container className="utbetalingshistorikk">
            <Lukknapp onClick={lukkUtbetalingshistorikk}>Lukk utbetalingshistorikk</Lukknapp>
            <Tabell
                beskrivelse={`Utbetalingshistorikk for person med fødselsnummer ${person.fødselsnummer}`}
                headere={headere}
                rader={rader}
            />
            {tilAnnullering && (
                <Annulleringsmodal
                    person={person}
                    organisasjonsnummer={tilAnnullering.arbeidsgiverOppdrag.orgnummer}
                    fagsystemId={tilAnnullering.arbeidsgiverOppdrag.fagsystemId}
                    linjer={linjer(tilAnnullering)}
                    onClose={() => setTilAnnullering(undefined)}
                    onSuccess={settValgtUtbetalingSomInFlight(tilAnnullering)}
                />
            )}
        </Container>
    );
};
