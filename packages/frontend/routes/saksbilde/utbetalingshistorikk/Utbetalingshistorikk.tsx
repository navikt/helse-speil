import styles from './Utbetalingshistorikk.module.scss';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Close } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

import { useQuery } from '@apollo/client';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { Arbeidsgiveroppdrag, HentOppdragDocument, Oppdrag, Spennoppdrag } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';

import { Annulleringsmodal } from '../annullering/Annulleringsmodal';
import { useKanAnnulleres } from '../annullering/useKanAnnulleres';
import { SaksbildeMenu } from '../saksbildeMenu/SaksbildeMenu';
import { UtbetalingshistorikkRow } from './UtbetalingshistorikkRow';

interface UtbetalingshistorikkWithContentProps {
    fødselsnummer: string;
    aktørId: string;
}

const UtbetalingshistorikkWithContent: React.FC<UtbetalingshistorikkWithContentProps> = ({
    fødselsnummer,
    aktørId,
}) => {
    const navigate = useNavigate();
    const { data } = useQuery(HentOppdragDocument, { variables: { fnr: fødselsnummer } });
    const kanAnnulleres = useKanAnnulleres(data?.oppdrag ?? []);
    const [tilAnnullering, setTilAnnullering] = useState<Spennoppdrag | undefined>();
    const [utbetalingIdTilAnnullering, setUtbetalingIdTilAnnullering] = useState<string | undefined>();
    const [varseltekst, setVarseltekst] = useState<string | undefined>();
    const [annulleringerInFlight, setAnnulleringerInFlight] = useState<Array<string>>([]);
    const readOnly = useIsReadOnlyOppgave();
    const activePeriod = useActivePeriod();

    const lukkUtbetalingshistorikk = () => navigate(`/person/${aktørId}/dagoversikt`);

    const settValgtOppdragSomInFlight = (oppdrag: Spennoppdrag) => () => {
        setAnnulleringerInFlight(annulleringerInFlight.concat([oppdrag.fagsystemId]));
    };

    const skalViseAnnulleringButton = (oppdrag: Oppdrag): boolean =>
        !readOnly &&
        (!(activePeriod as BeregnetPeriode)?.totrinnsvurdering?.erBeslutteroppgave ?? false) &&
        oppdrag.status === 'UTBETALT' &&
        oppdrag.type === 'UTBETALING';

    const oppdaterVarselTekst = () =>
        setVarseltekst(
            'Utbetalinger må annulleres kronologisk, nyeste først. Du kan forsøke å annullere denne, men om den ikke er den nyeste vil den ikke bli annullert.',
        );

    return (
        <>
            <div className={styles.saksbildemeny}>
                <SaksbildeMenu />
            </div>
            <div className={styles.utbetalingshistorikk}>
                <Button
                    className={styles.close}
                    as="button"
                    onClick={lukkUtbetalingshistorikk}
                    size="small"
                    variant="tertiary"
                >
                    <Close /> Lukk utbetalingshistorikk
                </Button>
                <table
                    className={styles.table}
                    aria-label={`Utbetalingshistorikk for person med fødselsnummer ${fødselsnummer ?? '"Ukjent"'}`}
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
                        {data?.oppdrag.map((oppdrag, i) => (
                            <React.Fragment key={i}>
                                {oppdrag.personoppdrag && (
                                    <UtbetalingshistorikkRow
                                        visAnnullering={skalViseAnnulleringButton(oppdrag)}
                                        kanAnnulleres={kanAnnulleres(oppdrag.personoppdrag)}
                                        setTilAnnullering={() => {
                                            setTilAnnullering(oppdrag.personoppdrag ?? undefined);
                                            setUtbetalingIdTilAnnullering(oppdrag.utbetalingId);
                                        }}
                                        oppdaterVarselTekst={oppdaterVarselTekst}
                                        oppdrag={oppdrag.personoppdrag}
                                        status={oppdrag.status}
                                        type={oppdrag.type}
                                    />
                                )}
                                {oppdrag.arbeidsgiveroppdrag && (
                                    <UtbetalingshistorikkRow
                                        visAnnullering={skalViseAnnulleringButton(oppdrag)}
                                        kanAnnulleres={kanAnnulleres(oppdrag.arbeidsgiveroppdrag)}
                                        setTilAnnullering={() => {
                                            setTilAnnullering(oppdrag.arbeidsgiveroppdrag ?? undefined);
                                            setUtbetalingIdTilAnnullering(oppdrag.utbetalingId);
                                        }}
                                        oppdaterVarselTekst={oppdaterVarselTekst}
                                        oppdrag={oppdrag.arbeidsgiveroppdrag}
                                        status={oppdrag.status}
                                        type={oppdrag.type}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                {tilAnnullering && (
                    <Annulleringsmodal
                        fødselsnummer={fødselsnummer}
                        aktørId={aktørId}
                        organisasjonsnummer={(tilAnnullering as Arbeidsgiveroppdrag)?.organisasjonsnummer}
                        fagsystemId={tilAnnullering.fagsystemId}
                        utbetalingId={utbetalingIdTilAnnullering ?? null}
                        skjæringstidspunkt={null}
                        linjer={tilAnnullering.linjer.map((it) => ({
                            ...it,
                            totalbeløp: it.totalbelop,
                        }))}
                        onClose={() => {
                            setTilAnnullering(undefined);
                            setVarseltekst(undefined);
                        }}
                        onSuccess={settValgtOppdragSomInFlight(tilAnnullering)}
                        varseltekst={varseltekst}
                    />
                )}
            </div>
        </>
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
