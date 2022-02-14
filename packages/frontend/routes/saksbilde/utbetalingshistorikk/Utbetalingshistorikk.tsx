import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Close } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { useOrganisasjonsnummer } from '@state/person';
import { UtbetalingshistorikkRow } from './UtbetalingshistorikkRow';
import { Annulleringsmodal } from '../sakslinje/annullering/Annulleringsmodal';

import { fetchOppdrag, Oppdrag, Spennoppdrag } from '@io/graphql';

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
    const [tilAnnullering, setTilAnnullering] = useState<Spennoppdrag | undefined>();
    const [annulleringerInFlight, setAnnulleringerInFlight] = useState<Array<string>>([]);
    const [oppdrag, setOppdrag] = useState<Array<Oppdrag>>([]);

    useEffect(() => {
        fetchOppdrag(person.fødselsnummer)
            .then(({ oppdrag }) => {
                setOppdrag(oppdrag as Array<Oppdrag>);
            })
            .catch((err) => console.error(err));
    }, [person]);

    const lukkUtbetalingshistorikk = () => push(`/person/${person.aktørId}/utbetaling`);

    const annulleringErForespurt = (oppdrag: Spennoppdrag) => annulleringerInFlight.includes(oppdrag.fagsystemId);

    const settValgtOppdragSomInFlight = (oppdrag: Spennoppdrag) => () => {
        setAnnulleringerInFlight(annulleringerInFlight.concat([oppdrag.fagsystemId]));
    };

    const annulleringButton = (status: Oppdrag['status'], type: Oppdrag['type'], oppdrag: Spennoppdrag) =>
        status === 'UTBETALT' && type === 'UTBETALING' ? (
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
                    {oppdrag.map((oppdrag, i) => (
                        <React.Fragment key={i}>
                            {oppdrag.personoppdrag && (
                                <UtbetalingshistorikkRow
                                    oppdrag={oppdrag.personoppdrag}
                                    status={oppdrag.status}
                                    type={oppdrag.type}
                                    annulleringButton={annulleringButton(
                                        oppdrag.status,
                                        oppdrag.type,
                                        oppdrag.personoppdrag
                                    )}
                                />
                            )}
                            {oppdrag.arbeidsgiveroppdrag && (
                                <UtbetalingshistorikkRow
                                    oppdrag={oppdrag.arbeidsgiveroppdrag}
                                    status={oppdrag.status}
                                    type={oppdrag.type}
                                    annulleringButton={annulleringButton(
                                        oppdrag.status,
                                        oppdrag.type,
                                        oppdrag.arbeidsgiveroppdrag
                                    )}
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
                    linjer={tilAnnullering.linjer.map((it) => ({
                        ...it,
                        totalbeløp: it.totalbelop,
                    }))}
                    onClose={() => setTilAnnullering(undefined)}
                    onSuccess={settValgtOppdragSomInFlight(tilAnnullering)}
                />
            )}
        </Container>
    );
};
