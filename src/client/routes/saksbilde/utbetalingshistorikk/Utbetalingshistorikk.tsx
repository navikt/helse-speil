import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { Close } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

import { Bold } from '../../../components/Bold';
import { useRefreshPersonVedUrlEndring } from '../../../hooks/useRefreshPersonVedUrlEndring';
import { findEarliest, findLatest } from '../../../utils/date';

import { anonymisertPersoninfo } from '../../../agurkdata';
import { Annulleringslinje, Annulleringsmodal } from '../sakslinje/annullering/Annulleringsmodal';
import { Cell } from './Cell';
import { FraCell } from './FraCell';
import { TilCell } from './TilCell';

const Container = styled.div`
    grid-column-start: venstremeny;
    grid-column-end: høyremeny;
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
`;

const CloseButton = styled(Button)`
    width: max-content;
    margin-bottom: 1.5rem;

    > svg {
        margin-right: 0.75rem;
    }
`;

const Table = styled.table`
    > thead > tr {
        height: 2rem;
        font-weight: 600;
        text-align: left;

        > th {
            padding: 0.5rem 0.75rem;
        }
    }

    > tbody > tr {
        height: 2rem;
        &:nth-child(2n-1) {
            background-color: var(--navds-color-gray-10);
        }
    }
`;

interface UtbetalingshistorikkProps {
    person: Person;
    anonymiseringEnabled: boolean;
}

export const Utbetalingshistorikk = ({ person, anonymiseringEnabled }: UtbetalingshistorikkProps) => {
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
        return [];
    });

    const linjer = (utbetaling: UtbetalingshistorikkUtbetaling): Annulleringslinje[] => [
        {
            fom: utbetaling && findEarliest(utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.map((l) => l.fom)),
            tom: utbetaling && findLatest(utbetaling.arbeidsgiverOppdrag.utbetalingslinjer.map((l) => l.tom)),
        },
    ];

    const fødselsnummer = anonymiseringEnabled ? anonymisertPersoninfo.fnr : person.fødselsnummer;

    return (
        <Container className="Utbetalingshistorikk">
            <CloseButton onClick={lukkUtbetalingshistorikk} size="s" variant="secondary">
                <Close /> Lukk utbetalingshistorikk
            </CloseButton>
            <Table aria-label={`Utbetalingshistorikk for person med fødselsnummer ${fødselsnummer}`}>
                <thead>
                    <tr>
                        <th>Fra</th>
                        <th>Til</th>
                        <th>Fagstystem-ID</th>
                        <th>Totalbeløp</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Annuller</th>
                    </tr>
                </thead>
                <tbody>
                    {person.utbetalinger.map((utbetaling, i) => (
                        <tr key={i}>
                            <FraCell utbetaling={utbetaling} />
                            <TilCell utbetaling={utbetaling} />
                            <Cell>
                                <Bold>{utbetaling.arbeidsgiverOppdrag.fagsystemId}</Bold>
                            </Cell>
                            <Cell>
                                <Bold>{utbetaling.totalbeløp ? `${utbetaling.totalbeløp} kr` : '-'}</Bold>
                            </Cell>
                            <Cell>
                                <Bold>{utbetaling.status}</Bold>
                            </Cell>
                            <Cell>
                                <Bold>{utbetaling.type}</Bold>
                            </Cell>
                            <Cell>
                                {annulleringErForespurt(utbetaling) ? (
                                    'Utbetalingen er forespurt annullert'
                                ) : visAnnulleringsknapp(utbetaling) ? (
                                    <Button size="s" onClick={() => setTilAnnullering(utbetaling)}>
                                        Annuller
                                    </Button>
                                ) : null}
                            </Cell>
                        </tr>
                    ))}
                </tbody>
            </Table>
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
