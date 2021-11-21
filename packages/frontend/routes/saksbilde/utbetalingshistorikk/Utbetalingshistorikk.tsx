import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { Close } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

import { useRefreshPersonVedUrlEndring } from '../../../hooks/useRefreshPersonVedUrlEndring';
import { useOrganisasjonsnummer, usePersoninfoRender } from '../../../state/person';

import { Annulleringslinje, Annulleringsmodal } from '../sakslinje/annullering/Annulleringsmodal';
import { UtbetalingshistorikkRow } from './UtbetalingshistorikkRow';

export type Oppdrag =
    | Required<UtbetalingshistorikkUtbetaling>['arbeidsgiverOppdrag']
    | Required<UtbetalingshistorikkUtbetaling>['personOppdrag'];

type FagsystemId = string;

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
    let { push } = useHistory();

    const fødselsnummer = usePersoninfoRender().fnr;
    const organisasjonsnummer = useOrganisasjonsnummer();
    const [tilAnnullering, setTilAnnullering] = useState<UtbetalingshistorikkUtbetaling | undefined>();
    const [annulleringerInFlight, setAnnulleringerInFlight] = useState<FagsystemId[]>([]);

    useRefreshPersonVedUrlEndring();

    const lukkUtbetalingshistorikk = () => push(`/person/${person.aktørId}/utbetaling`);

    const annulleringErForespurt = (oppdrag: Oppdrag) => annulleringerInFlight.includes(oppdrag.fagsystemId);

    const visAnnulleringsknapp = ({ status, type }: UtbetalingshistorikkUtbetaling) =>
        status === 'UTBETALT' && type === 'UTBETALING';

    const settValgtUtbetalingSomInFlight =
        ({ arbeidsgiverOppdrag, personOppdrag }: UtbetalingshistorikkUtbetaling) =>
        () => {
            const fagsystemIder = [arbeidsgiverOppdrag?.fagsystemId, personOppdrag?.fagsystemId].filter(
                (it) => it
            ) as FagsystemId[];
            if (fagsystemIder.length > 0) {
                setAnnulleringerInFlight(annulleringerInFlight.concat(fagsystemIder));
            }
        };

    const linjer = ({ arbeidsgiverOppdrag, personOppdrag }: UtbetalingshistorikkUtbetaling): Annulleringslinje[] =>
        (
            (
                [arbeidsgiverOppdrag?.utbetalingslinjer, personOppdrag?.utbetalingslinjer] as (
                    | undefined
                    | Annulleringslinje[]
                )[]
            ).filter((it) => it) as Annulleringslinje[][]
        ).flat() as Annulleringslinje[];

    return (
        <Container className="Utbetalingshistorikk">
            <CloseButton as="button" onClick={lukkUtbetalingshistorikk} size="small" variant="tertiary">
                <Close /> Lukk utbetalingshistorikk
            </CloseButton>
            <Table aria-label={`Utbetalingshistorikk for person med fødselsnummer ${fødselsnummer ?? '"Ukjent"'}`}>
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
                    {person.utbetalinger.map((utbetaling, i) => {
                        return (
                            <React.Fragment key={i}>
                                {utbetaling.arbeidsgiverOppdrag && (
                                    <UtbetalingshistorikkRow
                                        oppdrag={utbetaling.arbeidsgiverOppdrag}
                                        type={utbetaling.type}
                                        status={utbetaling.status}
                                        totalbeløp={utbetaling.totalbeløp}
                                        annulleringErForespurt={annulleringErForespurt(utbetaling.arbeidsgiverOppdrag)}
                                        onSetTilAnnullering={
                                            visAnnulleringsknapp(utbetaling)
                                                ? () => setTilAnnullering(utbetaling)
                                                : undefined
                                        }
                                    />
                                )}
                                {utbetaling.personOppdrag && (
                                    <UtbetalingshistorikkRow
                                        oppdrag={utbetaling.personOppdrag}
                                        type={utbetaling.type}
                                        status={utbetaling.status}
                                        totalbeløp={utbetaling.totalbeløp}
                                        annulleringErForespurt={annulleringErForespurt(utbetaling.personOppdrag)}
                                        onSetTilAnnullering={
                                            visAnnulleringsknapp(utbetaling)
                                                ? () => setTilAnnullering(utbetaling)
                                                : undefined
                                        }
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </Table>
            {tilAnnullering && (
                <Annulleringsmodal
                    person={person}
                    organisasjonsnummer={organisasjonsnummer}
                    fagsystemId={
                        (tilAnnullering.arbeidsgiverOppdrag?.fagsystemId ??
                            tilAnnullering.personOppdrag?.fagsystemId) as FagsystemId
                    }
                    linjer={linjer(tilAnnullering)}
                    onClose={() => setTilAnnullering(undefined)}
                    onSuccess={settValgtUtbetalingSomInFlight(tilAnnullering)}
                />
            )}
        </Container>
    );
};
