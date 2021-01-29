import styled from '@emotion/styled';
import React, { useState } from 'react';
import Element from 'nav-frontend-typografi/lib/element';
import { useHistory } from 'react-router';
import { Tabell } from '@navikt/helse-frontend-tabell';
import { Person, UtbetalingshistorikkUtbetaling } from 'internal-types';
import { Annulleringsmodal } from './Annulleringsmodal';
import { NORSK_DATOFORMAT_KORT } from '../../../utils/date';
import { useRefreshPersonVedUrlEndring } from '../../../hooks/useRefreshPersonVedUrlEndring';

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
    const [valgtUtbetaling, setValgtUtbetaling] = useState<UtbetalingshistorikkUtbetaling | undefined>();
    const [annulleringerInFlight, setAnnulleringerInFlight] = useState<string[]>([]);

    useRefreshPersonVedUrlEndring();

    const lukkUtbetalingshistorikk = () => history.push(`/person/${person.aktørId}/utbetaling`);

    const annulleringErForespurt = (utbetaling: UtbetalingshistorikkUtbetaling) =>
        annulleringerInFlight.includes(utbetaling.arbeidsgiverOppdrag.fagsystemId);

    const visAnnulleringsknapp = ({ status, type }: UtbetalingshistorikkUtbetaling) =>
        status === 'UTBETALT' && type === 'UTBETALING';

    const settValgtUtbetalingSomInFlight = () =>
        valgtUtbetaling &&
        setAnnulleringerInFlight(annulleringerInFlight.concat([valgtUtbetaling.arbeidsgiverOppdrag.fagsystemId]));

    const headere = ['Fra', 'Til', 'Fagsystem-ID', 'Status', 'Type', 'Annuller'];

    const rader = person.utbetalinger.map((utbetaling) => {
        let utbetalingslinjer = utbetaling.arbeidsgiverOppdrag.utbetalingslinjer;
        return [
            <Element>{utbetalingslinjer[0].fom.format(NORSK_DATOFORMAT_KORT)}</Element>,
            <Element>{utbetalingslinjer[utbetalingslinjer.length - 1].tom.format(NORSK_DATOFORMAT_KORT)}</Element>,
            <Element>{utbetaling.arbeidsgiverOppdrag.fagsystemId}</Element>,
            <Element>{utbetaling.status}</Element>,
            <Element>{utbetaling.type}</Element>,
            annulleringErForespurt(utbetaling) ? (
                'Utbetalingen er forespurt annullert'
            ) : visAnnulleringsknapp(utbetaling) ? (
                <button onClick={() => setValgtUtbetaling(utbetaling)}>Annuller</button>
            ) : null,
        ];
    });

    return (
        <Container className="utbetalingshistorikk">
            <Lukknapp onClick={lukkUtbetalingshistorikk}>Lukk utbetalingshistorikk</Lukknapp>
            <Tabell
                beskrivelse={`Utbetalingshistorikk for person med fødselsnummer ${person.fødselsnummer}`}
                headere={headere}
                rader={rader}
            />
            {valgtUtbetaling && (
                <Annulleringsmodal
                    person={person}
                    utbetaling={valgtUtbetaling}
                    onClose={() => setValgtUtbetaling(undefined)}
                    onSuccess={settValgtUtbetalingSomInFlight}
                />
            )}
        </Container>
    );
};
