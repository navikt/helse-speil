import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useHistory } from 'react-router';

import { Close } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Oppdrag, Spennoppdrag } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';

import { Annulleringsmodal } from '../saksbildeMenu/annullering/Annulleringsmodal';
import { UtbetalingshistorikkRow } from './UtbetalingshistorikkRow';
import { useOppdrag } from './state';

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
            background-color: var(--navds-global-color-gray-100);
        }
    }
`;

interface UtbetalingshistorikkWithContentProps {
    fødselsnummer: string;
    organisasjonsnummer: string;
    aktørId: string;
}

const UtbetalingshistorikkWithContent: React.FC<UtbetalingshistorikkWithContentProps> = ({
    fødselsnummer,
    organisasjonsnummer,
    aktørId,
}) => {
    let { push } = useHistory();
    const oppdrag = useOppdrag(fødselsnummer);
    const [tilAnnullering, setTilAnnullering] = useState<Spennoppdrag | undefined>();
    const [annulleringerInFlight, setAnnulleringerInFlight] = useState<Array<string>>([]);
    const readOnly = useIsReadOnlyOppgave();
    const activePeriod = useActivePeriod();

    const lukkUtbetalingshistorikk = () => push(`/person/${aktørId}/utbetaling`);

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
            <Table aria-label={`Utbetalingshistorikk for person med fødselsnummer ${fødselsnummer ?? '"Ukjent"'}`}>
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
                                    readOnly={readOnly}
                                    erBeslutteroppgave={
                                        ((activePeriod as BeregnetPeriode)?.erBeslutterOppgave ?? false) ||
                                        ((activePeriod as BeregnetPeriode)?.totrinnsvurdering?.erBeslutteroppgave ??
                                            false)
                                    }
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
                                    readOnly={readOnly}
                                    erBeslutteroppgave={
                                        ((activePeriod as BeregnetPeriode)?.erBeslutterOppgave ?? false) ||
                                        ((activePeriod as BeregnetPeriode)?.totrinnsvurdering?.erBeslutteroppgave ??
                                            false)
                                    }
                                />
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
            {tilAnnullering && (
                <Annulleringsmodal
                    fødselsnummer={fødselsnummer}
                    aktørId={aktørId}
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

const UtbetalingshistorikkContainer: React.FC = () => {
    const currentPerson = useCurrentPerson();
    const currentArbeidsgiver = useCurrentArbeidsgiver();

    if (!currentPerson || !currentArbeidsgiver) {
        return null;
    } else {
        return (
            <UtbetalingshistorikkWithContent
                fødselsnummer={currentPerson.fodselsnummer}
                organisasjonsnummer={currentArbeidsgiver.organisasjonsnummer}
                aktørId={currentPerson.aktorId}
            />
        );
    }
};

export const Utbetalingshistorikk: React.FC = () => {
    return (
        <React.Suspense fallback={<div />}>
            <ErrorBoundary fallback={<div />}>
                <UtbetalingshistorikkContainer />
            </ErrorBoundary>
        </React.Suspense>
    );
};

export default Utbetalingshistorikk;
