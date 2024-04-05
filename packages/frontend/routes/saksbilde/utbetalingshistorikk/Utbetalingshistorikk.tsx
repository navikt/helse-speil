import styles from './Utbetalingshistorikk.module.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Close } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

import { useQuery } from '@apollo/client';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { HentOppdragDocument } from '@io/graphql';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { useCurrentPerson } from '@state/person';

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

    const lukkUtbetalingshistorikk = () => navigate(`/person/${aktørId}/dagoversikt`);

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
                                        oppdrag={oppdrag.personoppdrag}
                                        status={oppdrag.status}
                                        type={oppdrag.type}
                                    />
                                )}
                                {oppdrag.arbeidsgiveroppdrag && (
                                    <UtbetalingshistorikkRow
                                        oppdrag={oppdrag.arbeidsgiveroppdrag}
                                        status={oppdrag.status}
                                        type={oppdrag.type}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
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
