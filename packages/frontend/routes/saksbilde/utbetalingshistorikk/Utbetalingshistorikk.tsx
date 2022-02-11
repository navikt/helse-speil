import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { Close } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { useOrganisasjonsnummer } from '../../../state/person';

import { Annulleringsmodal } from '../sakslinje/annullering/Annulleringsmodal';
import { UtbetalingshistorikkRow } from './UtbetalingshistorikkRow';

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

        &:nth-of-type(2n-1) {
            background-color: var(--navds-color-gray-10);
        }
    }
`;

interface UtbetalingshistorikkProps {
    person: Person;
}

export const Utbetalingshistorikk = ({ person }: UtbetalingshistorikkProps) => {
    let { push } = useHistory();
    const organisasjonsnummer = useOrganisasjonsnummer();
    const [tilAnnullering, setTilAnnullering] = useState<
        ExternalArbeidsgiveroppdrag | ExternalPersonoppdrag | undefined
    >();
    const [annulleringerInFlight, setAnnulleringerInFlight] = useState<Array<string>>([]);

    const utbetalinger: Array<ExternalUtbetalingElement> = person.utbetalinger;

    // useRefreshPersonVedUrlEndring();

    const lukkUtbetalingshistorikk = () => push(`/person/${person.aktørId}/utbetaling`);

    const annulleringErForespurt = (oppdrag: Oppdrag) => annulleringerInFlight.includes(oppdrag.fagsystemId);

    const settValgtOppdragSomInFlight = (oppdrag: ExternalArbeidsgiveroppdrag | ExternalPersonoppdrag) => () => {
        setAnnulleringerInFlight(annulleringerInFlight.concat([oppdrag.fagsystemId]));
    };

    const annulleringButton = (
        utbetaling: ExternalUtbetalingElement,
        oppdrag: ExternalArbeidsgiveroppdrag | ExternalPersonoppdrag
    ) =>
        utbetaling.status === 'UTBETALT' && utbetaling.type === 'UTBETALING' ? (
            <Button size="small" onClick={() => setTilAnnullering(oppdrag)}>
                Annuller
            </Button>
        ) : null;

    return (
        <Container className="Utbetalingshistorikk">
            <CloseButton as="button" onClick={lukkUtbetalingshistorikk} size="small" variant="tertiary">
                <Close /> Lukk utbetalingshistorikk
            </CloseButton>
            <Table
                aria-label={`Utbetalingshistorikk for person med fødselsnummer ${person.fødselsnummer ?? '"Ukjent"'}`}
            >
                <thead>
                    <tr>
                        <th>Fra</th>
                        <th>Til</th>
                        <th>Fagsystem-ID</th>
                        <th>Mottaker</th>
                        <th>Totalt</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {utbetalinger.map((utbetaling, i) => (
                        <React.Fragment key={i}>
                            {utbetaling.personoppdrag && (
                                <UtbetalingshistorikkRow
                                    oppdrag={utbetaling.personoppdrag}
                                    status={utbetaling.status}
                                    type={utbetaling.type}
                                    annulleringButton={annulleringButton(utbetaling, utbetaling.personoppdrag)}
                                />
                            )}
                            {utbetaling.arbeidsgiveroppdrag && (
                                <UtbetalingshistorikkRow
                                    oppdrag={utbetaling.arbeidsgiveroppdrag}
                                    status={utbetaling.status}
                                    type={utbetaling.type}
                                    annulleringButton={annulleringButton(utbetaling, utbetaling.arbeidsgiveroppdrag)}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
            {tilAnnullering && (
                <Annulleringsmodal
                    fødselsnummer={person.fødselsnummer}
                    aktørId={person.aktørId}
                    organisasjonsnummer={organisasjonsnummer}
                    fagsystemId={tilAnnullering.fagsystemId}
                    linjer={tilAnnullering.utbetalingslinjer}
                    onClose={() => setTilAnnullering(undefined)}
                    onSuccess={settValgtOppdragSomInFlight(tilAnnullering)}
                />
            )}
        </Container>
    );
};
